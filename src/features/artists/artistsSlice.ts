import * as artistsApi from "../../api/artistsApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts"

export type TopArtists = artistsApi.topArtistsDto[]

interface TopArtistsState {
    data: TopArtists | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: TopArtistsState = {
    data: null,
    status: "idle",
    error: null
}

export const fetchTopArtists = createAsyncThunk<TopArtists, void, { rejectValue: string }>("artists/fetchTop", async (_, { rejectWithValue }) => {
    try {
        return await artistsApi.getTopArtists(7)
    } catch(err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch top artists")
    }
})

const artistsSlice = createSlice({
    name: "artists",
    initialState,
    reducers: {
        clearTopArtists(state) {
            state.data = null
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopArtists.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchTopArtists.fulfilled, (state, action: PayloadAction<TopArtists>) => {
                state.data = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchTopArtists.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})


export const { clearTopArtists } = artistsSlice.actions
export default artistsSlice.reducer

export const selectTopArtists = (state: RootState) => state.artists.data
export const selectTopArtistsStatus = (state: RootState) => state.artists.status
export const selectTopArtistsError = (state: RootState) => state.artists.error