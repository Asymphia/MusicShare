import * as songsApi from "../../api/songsApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts"

export type RecommendedSongs = songsApi.SongDto[]

interface RecommendedSongsState {
    data: RecommendedSongs | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: RecommendedSongsState = {
    data: null,
    status: "idle",
    error: null
}

export const fetchRecommendedSongs = createAsyncThunk<RecommendedSongs, void, { rejectValue: string }>("songs/fetchRecommended", async (_, { rejectWithValue }) => {
    try {
        return await songsApi.getRecommendedSongs()
    } catch(err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch top songs")
    }
})

const recommendedSongsSlice = createSlice({
    name: "recommendedSongs",
    initialState,
    reducers: {
        clearRecommendedSongs(state) {
            state.data = null
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecommendedSongs.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchRecommendedSongs.fulfilled, (state, action: PayloadAction<RecommendedSongs>) => {
                state.data = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchRecommendedSongs.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})

export const { clearRecommendedSongs } = recommendedSongsSlice.actions
export default recommendedSongsSlice.reducer

export const selectRecommendedSongs = (state: RootState) => state.recommendedSongs.data
export const selectRecommendedSongsStatus = (state: RootState) => state.recommendedSongs.status
export const selectRecommendedSongsError = (state: RootState) => state.recommendedSongs.error