import * as genresApi from "../../api/genresApi.ts"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts"

export type TopGenres = genresApi.topGenresDto[]

interface TopGenresState {
    data: TopGenres | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: TopGenresState = {
    data: null,
    status: "idle",
    error: null
}

export const fetchTopGenres = createAsyncThunk<TopGenres, void, { rejectValue: string }>("genres/fetchTop", async (_, { rejectWithValue }) => {
    try {
        return await genresApi.getTopGenres(9)
    } catch(err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch top genres")
    }
})

const genresSlice = createSlice({
    name: "genres",
    initialState,
    reducers: {
        clearTopGenres(state) {
            state.data = null
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopGenres.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchTopGenres.fulfilled, (state, action: PayloadAction<TopGenres>) => {
                state.data = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchTopGenres.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})


export const { clearTopGenres } = genresSlice.actions
export default genresSlice.reducer

export const selectTopGenres = (state: RootState) => state.genres.data
export const selectTopGenresStatus = (state: RootState) => state.genres.status
export const selectTopGenresError = (state: RootState) => state.genres.error