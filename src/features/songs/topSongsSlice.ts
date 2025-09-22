import * as songsApi from "../../api/songsApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts"

export type TopSongs = songsApi.topSongsDto

interface TopSongsState {
    data: TopSongs | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: TopSongsState = {
    data: null,
    status: "idle",
    error: null
}

export const fetchTopSongs = createAsyncThunk<TopSongs, void, { rejectValue: string }>("songs/fetchTop", async (_, { rejectWithValue }) => {
    try {
        return await songsApi.getTopSongs(3)
    } catch(err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch top songs")
    }
})

const topSongsSlice = createSlice({
    name: "topSongs",
    initialState,
    reducers: {
        clearTopSongs(state) {
            state.data = null
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopSongs.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchTopSongs.fulfilled, (state, action: PayloadAction<TopSongs>) => {
                state.data = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchTopSongs.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})

export const { clearTopSongs } = topSongsSlice.actions
export default topSongsSlice.reducer

export const selectTopSongs = (state: RootState) => state.topSongs.data
export const selectTopSongsStatus = (state: RootState) => state.topSongs.status
export const selectTopSongsError = (state: RootState) => state.topSongs.error