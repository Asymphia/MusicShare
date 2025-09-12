import { Route, Routes } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./app/hooks.ts"
import { useEffect, useRef } from "react"
import { initAuth, refreshToken } from "./features/auth/authSlice.ts"
import { fetchPlaylists } from "./features/playlists/playlistsSlice.ts"
import { fetchUser } from "./features/user/userSlice.ts"
import { fetchListeningHistory } from "./features/listeningHistory/listeningHistorySlice.ts"
import { fetchTopSongs } from "./features/songs/songsSlice.ts"
import { fetchTopArtists } from "./features/artists/artistsSlice.ts"
import { fetchTopGenres } from "./features/genres/genresSlice.ts"

/* Layouts */
import MainLayout from "./layouts/MainLayout.jsx"

/* Pages */
import Dashboard from "./pages/Dashboard.tsx"
import Playlists from "./pages/Playlists.tsx"
import Create from "./pages/Create.tsx"
import Auth from "./pages/Auth.tsx"
import ProtectedRoute from "./routes/ProtectedRoute.tsx"
import SpotifyCallback from "./pages/SpotifyCallback.tsx"
import SinglePlaylist from "./pages/SinglePlaylist.tsx"
import SearchResults from "./pages/SearchResults.tsx"
import NotFound from "./pages/NotFound.tsx"

const App = () => {
    const dispatch = useAppDispatch()
    const token = useAppSelector(s => s.auth.token)
    const status = useAppSelector(s => s.auth.status)
    const timerRef = useRef<number | null>(null)

    useEffect(() => {
        dispatch(initAuth())
    }, [])

    useEffect(() => {
        if(timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }

        if(!token || status !== "authenticated" || !token.expiresAt) return

        const bufferSeconds = 60
        const expiresAtMs = new Date(token.expiresAt).getTime()
        let msUntilRefresh = expiresAtMs - Date.now() - bufferSeconds * 1000

        if(msUntilRefresh <= 0) {
            dispatch(refreshToken())
            return
        }

        timerRef.current = window.setTimeout(() => {
            dispatch(refreshToken())
        }, msUntilRefresh)

        return () => {
            if(timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
        }
    }, [token, status, dispatch])

    useEffect(() => {
        if(status === "authenticated") {
            dispatch(fetchPlaylists())
            dispatch(fetchUser())
            dispatch(fetchListeningHistory(4))
            dispatch(fetchTopSongs())
            dispatch(fetchTopArtists())
            dispatch(fetchTopGenres())
        }
    }, [status, dispatch])

    return (
        <Routes>
            <Route path="/auth/callback" element={<SpotifyCallback />} />

            <Route element={<ProtectedRoute redirectTo="/" inverse />} >
                <Route path="/login" element={<Auth/>}/>
            </Route>

            <Route element={<ProtectedRoute redirectTo="/login" /> } >
                <Route path="/" element={<MainLayout />} >
                    <Route index element={<Dashboard />} />
                    <Route path="playlists" element={<Playlists />} />
                    <Route path="create-new" element={<Create />} />

                    <Route path="playlists">
                        <Route index element={<Playlists />} />
                        <Route path=":slug" element={<SinglePlaylist />} />
                    </Route>

                    <Route path="/search/:query" element={<SearchResults />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App