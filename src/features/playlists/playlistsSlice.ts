import * as playlistApi from "../../api/playlistApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type {PlaylistDto} from "../../api/playlistApi";
import type {RootState} from "../../app/store.ts";

export type Song = playlistApi.SongDto
export type Playlist = playlistApi.PlaylistDto

export type PlaylistStateItem = PlaylistDto & {
    description?: string | null
    coverUrl?: string | null
    songs?: Song[]
    songStatus?: "idle" | "loading" | "succeeded" | "failed"
    songsError?: string | null
}

interface PlaylistsState {
    items: PlaylistStateItem[]
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

export const fetchPlaylistById = createAsyncThunk<{ id: number; detail: playlistApi.PlaylistDto }, number, { state: RootState; rejectValue: { id: number; message: string } }>("playlists/fetchById", async (id, thunkAPI) => {
    try {
        const details = await playlistApi.getPlaylistById(id)

        if (!details) {
            return thunkAPI.rejectWithValue({ id, message: "Playlist not found" })
        }

        const hasSongs = (details.songs?.length ?? 0) > 0
        if (hasSongs) {
            return { id, detail: details }
        }

        const state = thunkAPI.getState()
        const existing = state.playlists.items.find((p) => p.id === id)
        const spotifyId = details.spotifyId ?? existing?.spotifyId

        if (!spotifyId) {
            return thunkAPI.rejectWithValue({ id, message: "Missing spotifyId for playlist" })
        }

        const triggeredDetail = await playlistApi.triggerFetchSongsForSpotifyPlaylist(spotifyId)
        console.log(triggeredDetail)

        const refreshed = await playlistApi.getPlaylistById(triggeredDetail.id)

        if (!refreshed) {
            return thunkAPI.rejectWithValue({ id, message: "Playlist not found after triggering song fetch" })
        }

        return { id, detail: refreshed }
    } catch (err: any) {
        return thunkAPI.rejectWithValue({ id, message: err?.message ?? String(err) })
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
        },
        clearPlaylistsSongs(state, action: PayloadAction<number>) {
            const id = action.payload
            const idx = state.items.findIndex(p => p.id === id)

            if (idx >= 0) {
                state.items[idx].songs = undefined
                state.items[idx].songStatus = "idle"
                state.items[idx].songsError = null
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchPlaylists.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchPlaylists.fulfilled, (state, action: PayloadAction<Playlist[]>) => {
                state.items = action.payload.map(p => ({ ...p, songs: undefined, songsStatus: "idle", songsError: null }))
                state.status = "succeeded"
            })
            .addCase(fetchPlaylists.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
            .addCase(fetchPlaylistById.pending, (state, action) => {
                const id = action.meta.arg
                const idx = state.items.findIndex(p => p.id === id)

                if(idx >= 0) {
                    state.items[idx].songStatus = "loading"
                    state.items[idx].songsError = null
                } else {
                    state.items.push({ id, spotifyId: "", name: "", ownerName: "", songs: undefined, songStatus: "loading", songsError: null })
                }
            })
            .addCase(fetchPlaylistById.fulfilled, (state, action) => {
                const { id, detail } = action.payload
                const idx = state.items.findIndex(p => p.id === id)
                const updated: PlaylistStateItem = {
                    id: detail.id,
                    spotifyId: detail.spotifyId,
                    name: detail.name,
                    ownerName: detail.ownerName,
                    description: detail.description ?? null,
                    coverUrl: detail.coverImageUrl ?? null,
                    songs: detail.songs ?? [],
                    songStatus: "succeeded",
                    songsError: null
                }

                if (idx >= 0) {
                    state.items[idx] = { ...state.items[idx], ...updated }
                } else {
                    state.items.push(updated)
                }
            })
            .addCase(fetchPlaylistById.rejected, (state, action) => {
                const payload = action.payload
                const id = payload?.id ?? action.meta.arg
                const msg = payload?.message ?? action.error?.message ?? "Unknown error"
                const idx = state.items.findIndex(p => p.id === id)

                if(idx >= 0) {
                    state.items[idx].songStatus = "failed"
                    state.items[idx].songsError = msg
                } else {
                    state.items.push({ id, spotifyId: "", name: "", ownerName: "", songs: undefined, songStatus: "failed", songsError: msg })
                }
            })
    }
})

export const { clearPlaylists, clearPlaylistsSongs } = playlistsSlice.actions
export default playlistsSlice.reducer

export const selectPlaylists = (state: any) => state.playlists.items as Playlist[]
export const selectPlaylistsStatus = (state: any) => state.playlists.status as PlaylistsState["status"]
export const selectPlaylistsError = (state: any) => state.playlists.error as string | null

export const selectPlaylistById = (state: RootState, id: number) => state.playlists.items.find(p => p.id === id) as PlaylistStateItem | undefined

export const selectPlaylistSongsStatus = (state: RootState, id: number) => {
    const p = state.playlists.items.find(pp => pp.id === id)
    return p?.songStatus ?? "idle"
}