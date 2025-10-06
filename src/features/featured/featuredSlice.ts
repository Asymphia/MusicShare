import * as featuredApi from "../../api/featuredApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"

export type FeaturedData = featuredApi.featuredDto[]

interface FeaturedState {
    data: FeaturedData | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: FeaturedState = {
    data: null,
    status: "idle",
    error: null
}

export const fetchFeaturedData = createAsyncThunk<FeaturedData, void, { rejectValue: string }>("featured/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const data = [] as FeaturedData

        while(data.length <= 5) {
            const item = await featuredApi.getFeatured() as featuredApi.featuredDto

            if(!data.includes(item)) data.push(item)
        }

        return data
    } catch (err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch featured data")
    }
})

const featuredSlice = createSlice({
    name: "featured",
    initialState,
    reducers: {
        clearFeatured(state){
            state.data = null
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeaturedData.pending, state => {
                state.status = "loading"
                state.error = "null"
            })
            .addCase(fetchFeaturedData.fulfilled, (state, action: PayloadAction<FeaturedData>) => {
                state.data = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchFeaturedData.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})

export const { clearFeatured } = featuredSlice.actions
export default featuredSlice.reducer

export const selectFeatured = (state: RootState) => state.featured.data
export const selectFeaturedStatus = (state: RootState) => state.featured.status
export const selectFeaturedError = (state: RootState) => state.featured.error