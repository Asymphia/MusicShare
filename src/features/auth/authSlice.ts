import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type TokenResponse } from "./types.ts"
import * as tokenApi from "../../api/tokenApi.ts"

interface AuthState {
    token: TokenResponse | null
    status: "idle" | "loading" | "authenticated" | "unauthenticated"
    isRefreshing: boolean
}

const isExpired = (token: TokenResponse | null) => {
    if(!token) return true
    if (!token.expiresAt) return true

    const t = Date.parse(token.expiresAt)
    if (Number.isNaN(t)) return true

    return t <= Date.now()
}

const loadTokenFromStorage = (): TokenResponse | null => {
    try {
        const raw = localStorage.getItem("auth_token")
        if (!raw) return null
        const token = JSON.parse(raw) as TokenResponse

        return normalizeToken(token)
    } catch {
        return null
    }
}

const normalizeToken = (token: TokenResponse): TokenResponse => {
    if(token.expiresAt) return token

    if(token.expiresIn) {
        return { ...token, expiresAt: new Date(Date.now() + token.expiresIn * 1000).toISOString() }
    }

    return token
}

const tokenFromStorage = loadTokenFromStorage()

const initialState: AuthState = {
    token: tokenFromStorage,
    status: "idle",
    isRefreshing: false
}

export const saveTokenToApi = createAsyncThunk("auth/saveTokenToApi", async (token: TokenResponse) => {
    const normalized = normalizeToken(token)
    await tokenApi.postToken(normalized)
    localStorage.setItem("auth_token", JSON.stringify(normalized))
    return normalized
})

export const loginWithSpotify = createAsyncThunk("auth/loginWithSpotify", async (_, { rejectWithValue }) =>{
    try {
        const token = await tokenApi.getToken()

        if (!token) {
            return rejectWithValue("No token returned from API")
        }

        const normalized = normalizeToken(token)

        if (isExpired(normalized)) {
            if (!normalized.refreshToken) {
                return rejectWithValue("Token expired and no refresh token available")
            }

            try {
                const refreshed = await tokenApi.refreshAccessToken(normalized.refreshToken)
                const finalToken = normalizeToken(refreshed)
                await tokenApi.putToken(finalToken)
                localStorage.setItem("auth_token", JSON.stringify(finalToken))
                return finalToken
            } catch (err: any) {
                await tokenApi.deleteToken()
                return rejectWithValue("Failed to refresh token")
            }
        }

        return normalized
    } catch(err: any) {
        return rejectWithValue(err?.message ?? String(err))
    }
})

export const checkTokenValid = createAsyncThunk("auth/checkTokenValid", async () => {
    return await tokenApi.isTokenValid()
})

export const logout = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
    await tokenApi.deleteToken()
    dispatch(authSlice.actions.setUnauthenticated())
})

export const initAuth = createAsyncThunk("auth/initAuth", async () => {
    try {
        const localToken = loadTokenFromStorage()
        if (localToken && !isExpired(localToken)) {
            return localToken
        }

        const token = await tokenApi.getToken()
        if(!token) return null

        const normalized = normalizeToken(token)

        if(isExpired(normalized)) {
            if(!normalized.refreshToken) {
                return null
            }

            try {
                const refreshed = await tokenApi.refreshAccessToken(normalized.refreshToken)

                const finalToken = normalizeToken(refreshed)

                try {
                    await tokenApi.putToken(finalToken)
                    localStorage.setItem("auth_token", JSON.stringify(finalToken))
                } catch (err) {
                    return null
                }

                return finalToken
            } catch (err) {
                await tokenApi.deleteToken()
                return null
            }
        }

        localStorage.setItem("auth_token", JSON.stringify(normalized))
        return normalized
    } catch (err) {
        return null
    }
})

export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { getState, rejectWithValue }) => {
    const state = getState() as any
    const token = state.auth.token

    if (!token?.refreshToken) return rejectWithValue("No refresh token")

    try {
        const refreshed = await tokenApi.refreshAccessToken(token.refreshToken)

        const finalToken = normalizeToken(refreshed)

        try {
            await tokenApi.putToken(finalToken)
            localStorage.setItem("auth_token", JSON.stringify(finalToken))
        } catch (err) {
            return rejectWithValue("Failed to save token")
        }

        return finalToken
    } catch (err: any) {
        await tokenApi.deleteToken()
        return rejectWithValue("Refresh token invalid or revoked")
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUnauthenticated(state) {
            state.token = null
            state.status = "unauthenticated"
            localStorage.removeItem("auth_token")
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginWithSpotify.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loginWithSpotify.fulfilled, (state, action: PayloadAction<TokenResponse>) => {
                const normalized = normalizeToken(action.payload)
                state.token = normalized
                state.status = "authenticated"
                localStorage.setItem("auth_token", JSON.stringify(normalized))
            })
            .addCase(loginWithSpotify.rejected, (state) => {
                state.status = "unauthenticated"
            })
            .addCase(checkTokenValid.pending, (state) => {
                state.status = "loading"
            })
            .addCase(checkTokenValid.fulfilled, (state, action) => {
                state.status = action.payload ? "authenticated" : "unauthenticated"
                if(!action.payload) state.token = null
            })
            .addCase(saveTokenToApi.fulfilled, (state, action: PayloadAction<TokenResponse>) => {
                const normalized = normalizeToken(action.payload)
                state.token = normalized
                state.status = "authenticated"
                localStorage.setItem("auth_token", JSON.stringify(normalized))
            })
            .addCase(initAuth.pending, state => {
                state.status = "loading"
                state.isRefreshing = true
            })
            .addCase(initAuth.fulfilled, (state, action: PayloadAction<TokenResponse | null>) => {
                state.isRefreshing = false
                const token = action.payload as TokenResponse | null
                if(token && !isExpired(token)) {
                    const normalized = normalizeToken(token)
                    state.token = normalized
                    state.status = "authenticated"
                    localStorage.setItem("auth_token", JSON.stringify(normalized))
                } else {
                    state.token = null
                    state.status = "unauthenticated"
                    localStorage.removeItem("auth_token")
                }
            })
            .addCase(initAuth.rejected, state => {
                state.isRefreshing = false
                state.token = null
                state.status = "unauthenticated"
                localStorage.removeItem("auth_token")
            })
            .addCase(refreshToken.pending, state => {
                state.status = "loading"
            })
            .addCase(refreshToken.fulfilled, (state, action: PayloadAction<TokenResponse>) => {
                const normalized = normalizeToken(action.payload)
                state.token = normalized
                state.status = "authenticated"
                localStorage.setItem("auth_token", JSON.stringify(normalized))
            })
            .addCase(refreshToken.rejected, (state, action) => {
                console.error("RefreshToken failed: ", action.payload ?? action.payload)
                state.token = null
                state.status = "unauthenticated"
                localStorage.removeItem("auth_token")
            })
    }
})

export const { setUnauthenticated } = authSlice.actions
export default authSlice.reducer