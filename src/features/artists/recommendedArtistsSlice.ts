import * as artistsApi from "../../api/artistsApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts"

export type RecommendedArtists = artistsApi.artistsDto[]

interface RecommendedArtistsState {
    data: RecommendedArtists | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: RecommendedArtistsState = {
    data: null,
    status: "idle",
    error: null
}

export const fetchRecommendedArtists = createAsyncThunk<RecommendedArtists, void, { rejectValue: string }>("artists/fetchRecommended", async (_, { rejectWithValue }) => {
    try {
        return await artistsApi.getRecommendedArtists()
    } catch(err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch recommended artists")
    }
})

const recommendedArtistsSlice = createSlice({
    name: "recommendedArtists",
    initialState,
    reducers: {
        clearRecommendedArtists(state) {
            state.data = null
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecommendedArtists.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchRecommendedArtists.fulfilled, (state, action: PayloadAction<RecommendedArtists>) => {
                state.data = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchRecommendedArtists.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})


export const { clearRecommendedArtists } = recommendedArtistsSlice.actions
export default recommendedArtistsSlice.reducer

export const selectRecommendedArtists = (state: RootState) => state.recommendedArtists.data
export const selectRecommendedArtistsStatus = (state: RootState) => state.recommendedArtists.status
export const selectRecommendedArtistsError = (state: RootState) => state.recommendedArtists.error