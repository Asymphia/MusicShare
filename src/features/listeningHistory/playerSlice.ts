import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import type { ListeningHistoryItemDto } from "../../api/listeningHistoryApi"
import * as api from "../../api/listeningHistoryApi"

interface PlayerState {
    currentSong: ListeningHistoryItemDto | null
    isPlaying: boolean
    currentTime: number
    duration: number
    volume: number
}

const initialState: PlayerState = {
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1
}

export const postAndRefetchHistory = createAsyncThunk<ListeningHistoryItemDto[], { spotifySongId: string; playlistId?: number}, { rejectValue: string }>("player/postAndRefetchHistory", async ({ spotifySongId, playlistId }, { rejectWithValue }) => {
    try {
        await api.postListeningHistory(spotifySongId, playlistId)
        return await api.getListeningHistory(4)
    } catch(err: any) {
        return rejectWithValue(err?.message ?? "Failed to post history")
    }
})

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setCurrentSong(state, action: PayloadAction<ListeningHistoryItemDto | null>) {
            state.currentSong = action.payload
            state.currentTime = 0
            state.duration = action.payload?.songShort.songLengthInSeconds || 0
        },
        togglePlayPause(state) {
            state.isPlaying = !state.isPlaying
        },
        setIsPlaying(state, action: PayloadAction<boolean>) {
            state.isPlaying = action.payload
        },
        setCurrentTime(state, action: PayloadAction<number>) {
            state.currentTime = action.payload
        },
        setDuration(state, action: PayloadAction<number>) {
            state.duration = action.payload
        },
        setVolume(state, action: PayloadAction<number>) {
            state.volume = action.payload
        },
        seekTo(state, action: PayloadAction<number>) {
            state.currentTime = action.payload
        },
        resetPlayer(state) {
            state.currentSong = null
            state.isPlaying = false
            state.currentTime = 0
            state.duration = 0
        }
    }
})

export const {
    setCurrentSong,
    togglePlayPause,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    seekTo,
    resetPlayer
} = playerSlice.actions

export default playerSlice.reducer

export const selectCurrentSong = (state: RootState) => state.player.currentSong
export const selectIsPlaying = (state: RootState) => state.player.isPlaying
export const selectCurrentTime = (state: RootState) => state.player.currentTime
export const selectDuration = (state: RootState) => state.player.duration
export const selectVolume = (state: RootState) => state.player.volume