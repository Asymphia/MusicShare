import type {PlaylistDto} from "../../api/playlistApi"
import * as playlistApi from "../../api/playlistApi"
import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit"
import type {RootState} from "../../app/store.ts"
import {getSongById} from "../../api/songsApi"

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
        const spotifyPlaylist = await playlistApi.getAllSpotifyPlaylists()
        const databasePlaylists = await playlistApi.getAllPlaylists()

        return Array.from(new Map(
            [...spotifyPlaylist, ...databasePlaylists].map(p => [p.id, p])
        ).values())
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

        const hasSongs = details.isFetched
        if (hasSongs) {
            return { id, detail: details }
        }

        const state = thunkAPI.getState()
        const existing = state.playlists.items.find((p) => p.id === id)
        const spotifyId = details.spotifyId ?? existing?.spotifyId

        if (!spotifyId) {
            return { id, detail: details }
        }

        const triggeredDetail = await playlistApi.triggerFetchSongsForSpotifyPlaylist(spotifyId)

        await playlistApi.putIsFetched(true, id)

        const refreshed = await playlistApi.getPlaylistById(triggeredDetail.id)

        if (!refreshed) {
            return thunkAPI.rejectWithValue({ id, message: "Playlist not found after triggering song fetch" })
        }

        return { id, detail: refreshed }
    } catch (err: any) {
        return thunkAPI.rejectWithValue({ id, message: err?.message ?? String(err) })
    }
})

export const postPlaylist = createAsyncThunk<Playlist, { name: string; description?: string | null; coverPhoto?: File | null; ownerName: string }, { rejectValue: string }>("playlists/post", async (payload, { rejectWithValue }) => {
    try {
        const fd = new FormData()
        fd.append("name", payload.name)
        fd.append("description", payload.description ?? "")
        fd.append("ownerName", payload.ownerName ?? "")

        if(payload.coverPhoto) {
            fd.append("coverPhoto", payload.coverPhoto, payload.coverPhoto.name)
        }

        const result = await playlistApi.postPlaylist(fd)
        return result
    } catch (err: any) {
        return rejectWithValue(err?.message ?? String(err))
    }
})

export const postSongToPlaylist = createAsyncThunk<{ playlistId: number, song: Song }, { playlistId: number, songId: string }, { rejectValue: string }>("playlists/postSong", async ({ playlistId, songId }, thunkAPI) => {
    try {
        await playlistApi.postSongToPlaylist(songId, playlistId)

        const song = await getSongById(songId) as Song
        console.log(song)

        return { playlistId, song: song }
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err?.message ?? String(err))
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
            .addCase(postPlaylist.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(postPlaylist.fulfilled, (state, action: PayloadAction<Playlist>) => {
                const detail = action.payload

                const item: PlaylistStateItem = {
                    id: detail.id,
                    spotifyId: null,
                    name: detail.name,
                    ownerName: detail.ownerName,
                    description: detail.description ?? null,
                    coverUrl: (detail as any).coverImageUrl ?? (detail as any).coverUrl ?? null,
                    songs: [],
                    songStatus: "succeeded",
                    songsError: null
                }

                const idx = state.items.findIndex(p => p.id === item.id)
                if (idx >= 0) {
                    state.items[idx] = { ...state.items[idx], ...item }
                } else {
                    state.items.push(item)
                }

                state.status = "succeeded"
            })
            .addCase(postPlaylist.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Failed to create playlist"
            })
            .addCase(postSongToPlaylist.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(postSongToPlaylist.fulfilled, (state, action) => {
                const { playlistId, song } = action.payload
                const idx = state.items.findIndex(p => p.id === playlistId)

                if (idx >= 0) {
                    state.items[idx].songs = state.items[idx].songs ?? []

                    if (!state.items[idx].songs!.some(s => s.spotifyId === song.spotifyId)) {
                        state.items[idx].songs!.push(song)
                    }

                    state.items[idx].songStatus = "succeeded"
                    state.items[idx].songsError = null
                }

                state.status = "succeeded"
            })
            .addCase(postSongToPlaylist.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Failed to add song to a playlist"
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