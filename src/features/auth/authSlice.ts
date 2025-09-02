import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type TokenResponse } from "./types.ts"
import * as tokenApi from "../../api/tokenApi.ts"

interface AuthState {
    token: TokenResponse | null
    status: "idle" | "loading" | "authenticated" | "unauthenticated"
}

const loadTokenFromStorage = (): TokenResponse | null => {
    try {
        const raw = localStorage.getItem("auth_token")
        if(!raw) return null

        const parsed = JSON.parse(raw) as TokenResponse & { savedAt?: string; expiresAt?: string }

        if(parsed.expiresAt) return parsed

        if(parsed.savedAt && parsed.expiresIn) {
            const savedAt = new Date(parsed.savedAt).getTime()
            const expiresAt = new Date(savedAt + parsed.expiresIn * 1000).toISOString()
            return { ...parsed, expiresAt }
        }

        if(parsed.expiresIn) {
            const expiresAt = new Date(Date.now() + parsed.expiresIn * 1000).toISOString()
            return { ...parsed, expiresAt }
        }

        return parsed
    } catch (e) {
        console.warn("Failed to parse auth token from local storage", e)
        return null
    }
}

const isExpired = (token: TokenResponse | null) => {
    if(!token) return true

    if(token.expiresAt) {
        return new Date(token.expiresAt).getTime() <= Date.now()
    }

    return true
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
    token: tokenFromStorage && !isExpired(tokenFromStorage) ? tokenFromStorage : null,
    status: tokenFromStorage && !isExpired(tokenFromStorage) ? "authenticated" : "idle" // tu było unauthincated
}

export const saveTokenToApi = createAsyncThunk("auth/saveTokenToApi", async (token: TokenResponse) => {
    await tokenApi.postToken(token)
    return token
})

export const loginWithSpotify = createAsyncThunk("auth/loginWithSpotify", async () =>{
    return await tokenApi.getToken()
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
        const token = await tokenApi.getToken()
        return token as TokenResponse
    } catch (err) {
        return null as unknown as TokenResponse
    }
})

export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { getState, rejectWithValue }) => {
    const state = getState() as any
    const current: TokenResponse | null = state.auth?.token ?? null

    if(!current || !current.refreshToken) {
        return rejectWithValue("No refresh token available")
    }

    try {
        const resp = await tokenApi.refreshAccessToken(current.refreshToken)

        const newToken: TokenResponse = {
            accessToken: resp.access_token,
            refreshToken: resp.refresh_token ?? current.refreshToken,
            expiresIn: resp.expires_in,
            tokenType: resp.token_type,
            scope: resp.scope,
            hasRefreshToken: Boolean(resp.refresh_token ?? current.refreshToken)
        }

        const normalized = normalizeToken(newToken)

        await tokenApi.putToken({
            accessToken: normalized.accessToken,
            expiresIn: normalized.expiresIn,
            state: normalized.state ?? "",
            scope: normalized.scope ?? "",
            refreshToken: normalized.refreshToken ?? ""
        })

        return normalized
    } catch (err: any) {
        return rejectWithValue(err?.message ?? String(err))
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
                localStorage.setItem("auth_token", JSON.stringify(action.payload))
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
                localStorage.setItem("auth_token", JSON.stringify(action.payload))
            })
            .addCase(initAuth.pending, state => {
                state.status = "loading"
            })
            .addCase(initAuth.fulfilled, (state, action: PayloadAction<TokenResponse | null>) => {
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