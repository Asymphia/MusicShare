import * as playlistApi from "../../api/playlistApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Playlist = playlistApi.PlaylistDto

interface PlaylistsState {
    items: Playlist[]
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: PlaylistsState = {
    items: [],
    status: "idle",
    error: null
}

export const fetchPlaylists = createAsyncThunk<Playlist[], void, { rejectValue: string }>("playlists/fetchAll", async (_, { rejectWithValue }) => {
    try {
        return await playlistApi.getAllPlaylists()
    } catch (err: any) {
        return rejectWithValue(err?.message ?? String(err))
    }
})

const playlistsSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        clearPlaylists(state) {
            state.items = []
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchPlaylists.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchPlaylists.fulfilled, (state, action: PayloadAction<Playlist[]>) => {
                state.items = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchPlaylists.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})

export const { clearPlaylists } = playlistsSlice.actions
export default playlistsSlice.reducer

export const selectPlaylists = (state: any) => state.playlists.items as Playlist[]
export const selectPlaylistsStatus = (state: any) => state.playlists.status as PlaylistsState["status"]
export const selectPlaylistsError = (state: any) => state.playlists.error as string | null