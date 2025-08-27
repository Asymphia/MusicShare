import { Route, Routes } from "react-router-dom"

/* Layouts */
import MainLayout from "./layouts/MainLayout.jsx"

/* Pages */
import Dashboard from "./pages/Dashboard.jsx"
import Playlists from "./pages/Playlists.jsx"
import Discover from "./pages/Discover.jsx"
import Create from "./pages/Create.jsx"
import Auth from "./pages/Auth.jsx"
import ProtectedRoute from "./routes/ProtectedRoute.tsx"
import SpotifyCallback from "./pages/SpotifyCallback.tsx"

const App = () => {
    return (
        <Routes>
            <Route path="/auth/callback" element={<SpotifyCallback />} />

            <Route element={<ProtectedRoute redirectTo="/" inverse />} >
                <Route path="/login" element={<Auth/>}/>
            </Route>

            <Route element={<ProtectedRoute redirectTo="/login" /> } >
                <Route path="/" element={<MainLayout />} >
                    <Route index element={<Dashboard />} />
                    <Route path="discover" element={<Discover />} />
                    <Route path="my-playlists" element={<Playlists />} />
                    <Route path="create-new" element={<Create />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default App