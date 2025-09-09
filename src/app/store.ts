import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice.ts"
import playlistsReducer from "../features/playlists/playlistsSlice.ts"
import userReducer from "../features/user/userSlice.ts"
import listeningHistoryReducer from "../features/listeningHistory/listeningHistorySlice.ts"
import songsReducer from "../features/songs/songsSlice.ts"
import artistsReducer from "../features/artists/artistsSlice.ts"
import genresReducer from "../features/genres/genresSlice.ts"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        playlists: playlistsReducer,
        user: userReducer,
        listeningHistory: listeningHistoryReducer,
        songs: songsReducer,
        artists: artistsReducer,
        genres: genresReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch