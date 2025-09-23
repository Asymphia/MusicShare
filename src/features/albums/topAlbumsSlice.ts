import * as albumsApi from "../../api/albumsApi.ts"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts"

export type TopAlbums = albumsApi.topAlbumsDto[]

interface TopAlbumsState {
    data: TopAlbums | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: TopAlbumsState = {
    data: null,
    status: "idle",
    error: null
}

export const fetchTopAlbums = createAsyncThunk<TopAlbums, void, { rejectValue: string }>("albums/fetchTop", async (_, { rejectWithValue }) => {
    try {
        return await albumsApi.getTopAlbums(3)
    } catch(err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch top albums")
    }
})

const topAlbumsSlice = createSlice({
    name: "topAlbums",
    initialState,
    reducers: {
        clearTopAlbums(state) {
            state.data = null
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopAlbums.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchTopAlbums.fulfilled, (state, action: PayloadAction<TopAlbums>) => {
                state.data = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchTopAlbums.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})

export const { clearTopAlbums } = topAlbumsSlice.actions
export default topAlbumsSlice.reducer

export const selectTopAlbums = (state: RootState) => state.topAlbums.data
export const selectTopAlbumsStatus = (state: RootState) => state.topAlbums.status
export const selectTopAlbumsError = (state: RootState) => state.topAlbums.error