import * as api from "../../api/listeningHistoryApi.ts"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts"

export type ListeningHistoryItem = api.ListeningHistoryItemDto

interface ListeningHistoryState {
    items: ListeningHistoryItem[]
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: ListeningHistoryState = {
    items: [],
    status: "idle",
    error: null
}

export const fetchListeningHistory = createAsyncThunk<ListeningHistoryItem[], number, { rejectValue: string }>("listeningHistory/fetch", async (take: number, {rejectWithValue}) => {
    try {
        return await api.getListeningHistory(take)
    } catch(err: any) {
        return rejectWithValue(err?.message ?? "Failed to fetch listening history")
    }
})

const listeningHistorySlice = createSlice({
    name: "listeningHistory",
    initialState,
    reducers: {
        clearListeningHistory(state) {
            state.items = []
            state.status = "idle"
            state.error = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchListeningHistory.pending, state => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchListeningHistory.fulfilled, (state, action: PayloadAction<ListeningHistoryItem[]>) => {
                state.items = action.payload
                state.status = "succeeded"
            })
            .addCase(fetchListeningHistory.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? action.error?.message ?? "Unknown error"
                state.items = []
            })
    }
})

export const { clearListeningHistory } = listeningHistorySlice.actions
export default listeningHistorySlice.reducer

export const selectListeningHistoryItems = (state: RootState) => state.listeningHistory.items
export const selectListeningHistoryStatus = (state: RootState) => state.listeningHistory.status
export const selectListeningHistoryError = (state: RootState) => state.listeningHistory.error