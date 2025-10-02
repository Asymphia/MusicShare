import * as albumsApi from "../../api/albumsApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts"

export type Albums = albumsApi.albumsDto[]

interface AlbumsState {
    data: Albums | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: AlbumsState = {
    data: null,
    status: "idle",
    error: null
}

export const fetchAlbums = createAsyncThunk<Albums, void, { rejectValue: string }>("albums/fetchAll", async (_, { rejectWithValue }) => {
    try {
        return await albumsApi.getAllAlbums()
    } catch (err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch all albums")
    }
})

const albumsSlice = createSlice({
    name: "albums",
    initialState,
    reducers: {
        clearAlbums(state) {
            state.data = null
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlbums.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchAlbums.fulfilled, (state, action: PayloadAction<Albums>) => {
                state.data = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchAlbums.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})

export const { clearAlbums } = albumsSlice.actions
export default albumsSlice.reducer

export const selectAlbums = (state: RootState) => state.albums.data
export const selectAlbumsStatus = (state: RootState) => state.albums.status
export const selectAlbumsError = (state: RootState) => state.albums.error