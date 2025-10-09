import * as songsApi from "../../api/songsApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts"
import { getAudioDuration } from "../../lib/audio"
import {mapServerToPutDto, normalizeFetchedSong} from "../../lib/mappers";

export type Songs = songsApi.SongDto[]

interface SongsState {
    data: Songs | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: SongsState = {
    data: null,
    status: "idle",
    error: null
}

export const fetchSongs = createAsyncThunk<Songs, void, { rejectValue: string }>("songs/fetchAll", async (_, { rejectWithValue }) => {
    try {
        return await songsApi.getAllSongs()
    } catch(err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch top songs")
    }
})

export const uploadSongFile = createAsyncThunk<songsApi.SongDto, { songId: string; file: File }, { rejectValue: string }>("songs/uploadFile", async ({ songId, file }, { rejectWithValue }) => {
    try {
        const duration = await getAudioDuration(file)

        const durationSeconds = Math.round(duration)

       await songsApi.postSongFile(songId, file)

        const rawFresh = await songsApi.getSongById(songId)
        console.log(rawFresh, "Raw Fresh")
        const fresh = normalizeFetchedSong(rawFresh)
        console.log(fresh, " Fresh")
        const putBody = mapServerToPutDto(fresh, { songLengthInSeconds: durationSeconds })
        console.log(putBody, "put body")

        await songsApi.putSong(songId, putBody)

        return await songsApi.getSongById(songId)
    } catch(err: any) {
        return rejectWithValue(err?.message ?? "Failed to upload file")
    }
})

export const deleteSongFile = createAsyncThunk<songsApi.SongDto, { songId: string }, { rejectValue: string }>("songs/deleteFile", async ({ songId }, { rejectWithValue }) => {
    try {
        await songsApi.deleteSongFile(songId)
        return songsApi.getSongById(songId)
    } catch (err: any) {
        return rejectWithValue(err?.message ?? "Failed to delete song file")
    }
})

const songsSlice = createSlice({
    name: "songs",
    initialState,
    reducers: {
        clearSongs(state) {
            state.data = null
            state.status = "idle"
            state.error = null
        },
        updateSongInState(state, action: PayloadAction<songsApi.SongDto>) {
            if(!state.data) return
            state.data = state.data.map(s => (s.spotifyId === action.payload.spotifyId ? action.payload : s))
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSongs.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchSongs.fulfilled, (state, action: PayloadAction<Songs>) => {
                state.data = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchSongs.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
            .addCase(uploadSongFile.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(uploadSongFile.fulfilled, (state, action: PayloadAction<songsApi.SongDto>) => {
                if(!state.data) {
                    state.data = [action.payload]
                } else {
                    state.data = state.data.map((s) => (s.spotifyId === action.payload.spotifyId ? action.payload : s))
                }
                state.status = "succeeded"
            })
            .addCase(uploadSongFile.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Upload failed"
            })
            .addCase(deleteSongFile.pending, state => {
                state.status = "loading"
                state.error = "null"
            })
            .addCase(deleteSongFile.fulfilled, (state, action: PayloadAction<songsApi.SongDto>) => {
                if (!state.data) {
                    state.data = [action.payload]
                } else {
                    state.data = state.data.map((s) => (s.spotifyId === action.payload.spotifyId ? action.payload : s))
                }
                state.status = "succeeded"
            })
            .addCase(deleteSongFile.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
            })
    }
})

export const { clearSongs } = songsSlice.actions
export default songsSlice.reducer

export const selectSongs = (state: RootState) => state.songs.data
export const selectSongsStatus = (state: RootState) => state.songs.status
export const selectSongsError = (state: RootState) => state.songs.error