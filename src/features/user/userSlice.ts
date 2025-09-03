import * as userApi from "../../api/userApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type {RootState} from "../../app/store.ts"

export type User = userApi.UserDto

interface UserState {
    data: User | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: UserState = {
    data: null,
    status: "idle",
    error: "null"
}

export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>("user/fetchCurrent", async (_, { rejectWithValue }) => {
    try {
        return await userApi.getCurrentUser()
    } catch(err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch user")
    }
})

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUser(state) {
            state.data = null
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.data = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})

export const { clearUser } = userSlice.actions
export default userSlice.reducer

export const selectUser = (state: RootState) => state.user.data
export const selectUserStatus = (state: RootState) => state.user.status
export const selectUserError = (state: RootState) => state.user.error