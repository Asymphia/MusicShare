import * as albumApi from "../../api/albumsApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"

export type RecommendedAlbums = albumApi.albumsDto[]

interface RecommendedAlbumsState {
    data: RecommendedAlbums | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: RecommendedAlbumsState = {
    data: null,
    status: "idle",
    error: null
}

export const fetchRecommendedAlbums = createAsyncThunk<RecommendedAlbums, void, { rejectValue: string }>("albums/fetchRecommended", async (_, { rejectWithValue }) => {
    try {
        return await albumApi.getFeaturedAlbums(5)
    } catch (err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch featured albums")
    }
})

const recommendedAlbumsSlice = createSlice({
    name: "recommendedAlbums",
    initialState,
    reducers: {
        clearRecommendedAlbums(state){
            state.data = null
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecommendedAlbums.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchRecommendedAlbums.fulfilled, (state, action: PayloadAction<RecommendedAlbums>) => {
                state.data = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchRecommendedAlbums.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})

export const { clearRecommendedAlbums } = recommendedAlbumsSlice.actions
export default recommendedAlbumsSlice.reducer

export const selectRecommendedAlbums = (state: RootState) => state.recommendedAlbums.data
export const selectRecommendedAlbumsStatus = (state: RootState) => state.recommendedAlbums.status
export const selectRecommendedAlbumsError = (state: RootState) => state.recommendedAlbums.error