import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit"
import {type TokenResponse} from "./types.ts"
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

        if(parsed.expiresAt && parsed.savedAt) {
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

const tokenFromStorage = loadTokenFromStorage()

const initialState: AuthState = {
    token: tokenFromStorage && !isExpired(tokenFromStorage) ? tokenFromStorage : null,
    status: tokenFromStorage && !isExpired(tokenFromStorage) ? "authenticated" : "unauthenticated"
}

export const saveTokenToApi = createAsyncThunk("auth/saveTokenToApi", async (token: TokenResponse) => {
    return await tokenApi.postToken(token)
})

export const loginWithSpotify = createAsyncThunk("auth/loginWithSpotify", async () =>{
    return await tokenApi.getToken()
})

export const checkTokenValid = createAsyncThunk("auth/checkTokenValid", async () => {
    return await tokenApi.isTokenValid()
})

export const logout = createAsyncThunk("auth/login", async (_, { dispatch }) => {
    await tokenApi.deleteToken()
    dispatch(authSlice.actions.setUnauthenticated())
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
                state.token = action.payload
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
    }
})

export const { setUnauthenticated } = authSlice.actions
export default authSlice.reducer