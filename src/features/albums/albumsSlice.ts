import * as albumsApi from "../../api/albumsApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts"

export type Albums = albumsApi.albumsDto[]
export type Song = albumsApi.SongDto

interface AlbumsState {
    data: Albums | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
    songs?: Song[]
    songsStatus?: "idle" | "loading" | "succeeded" | "failed"
    songsError?: string | null
}

const initialState: AlbumsState = {
    data: null,
    status: "idle",
    error: null,
    songs: undefined,
    songsStatus: "idle",
    songsError: null
}

export const fetchAlbums = createAsyncThunk<Albums, void, { rejectValue: string }>("albums/fetchAll", async (_, { rejectWithValue }) => {
    try {
        return await albumsApi.getAllAlbums()
    } catch (err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch all albums")
    }
})

export const fetchAlbumById = createAsyncThunk<{ albumId: string; detail: albumsApi.albumsDto }, string, { state: RootState; rejectValue: { albumId: string; message: string } }>("albums/fetchById", async (albumId, thunkAPI) => {
    try {
        const details = await albumsApi.getAlbumById(albumId)

        if(!details) {
            return thunkAPI.rejectWithValue({ albumId, message: "Album not found" })
        }

        return { albumId, detail: details }
    } catch (err: any) {
        return thunkAPI.rejectWithValue({ albumId, message: err?.message ?? String(err) })
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
            .addCase(fetchAlbumById.pending, state => {
                state.songsStatus = "loading"
                state.songsError = null
            })
            .addCase(fetchAlbumById.fulfilled, (state, action) => {
                state.songsStatus = "succeeded"
                state.songsError = null

                const detail = action.payload.detail

                if ((detail as any).songs && Array.isArray((detail as any).songs)) {
                    state.songs = (detail as any).songs as Song[]
                }

                if (!state.data) {
                    state.data = [detail]
                } else {
                    const getId = (a: any) => a.spotifyId ?? a.id ?? String(a.albumId ?? "")
                    const incomingId = getId(detail)

                    const idx = state.data.findIndex(a => getId(a) === incomingId)
                    if (idx !== -1) {
                        state.data[idx] = detail
                    } else {
                        state.data.push(detail)
                    }
                }
            })
            .addCase(fetchAlbumById.rejected, (state, action) => {
                state.songsStatus = "failed"
                const payload = action.payload as { albumId: string; message: string } | undefined
                state.songsError = payload?.message ?? action.error?.message ?? "Failed to fetch album"
            })
    }
})

export const { clearAlbums } = albumsSlice.actions
export default albumsSlice.reducer

export const selectAlbums = (state: RootState) => state.albums.data
export const selectAlbumsStatus = (state: RootState) => state.albums.status
export const selectAlbumsError = (state: RootState) => state.albums.error

export const selectAlbumById = (state: RootState, albumId: string)=> state.albums.data?.find(a => a.spotifyId === albumId)

export const selectAlbumsSongsStatus = (state: RootState, albumId: string) => {
    const a = state.playlists.items.find(aa => aa.spotifyId === albumId)
    return a?.songStatus ?? "idle"
}