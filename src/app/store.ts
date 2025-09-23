import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice.ts"
import playlistsReducer from "../features/playlists/playlistsSlice.ts"
import userReducer from "../features/user/userSlice.ts"
import listeningHistoryReducer from "../features/listeningHistory/listeningHistorySlice.ts"
import topSongsReducer from "../features/songs/topSongsSlice.ts"
import artistsReducer from "../features/artists/artistsSlice.ts"
import genresReducer from "../features/genres/genresSlice.ts"
import songsReducer from "../features/songs/songsSlice.ts"
import topAlbumsReducer from "../features/albums/topAlbumsSlice.ts"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        playlists: playlistsReducer,
        user: userReducer,
        listeningHistory: listeningHistoryReducer,
        topSongs: topSongsReducer,
        songs: songsReducer,
        artists: artistsReducer,
        genres: genresReducer,
        topAlbums: topAlbumsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch