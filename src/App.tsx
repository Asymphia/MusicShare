import { Route, Routes } from "react-router-dom"

/* Layouts */
import MainLayout from "./layouts/MainLayout.jsx"

/* Pages */
import Dashboard from "./pages/Dashboard.jsx"
import Playlists from "./pages/Playlists.jsx"
import Discover from "./pages/Discover.jsx"
import Create from "./pages/Create.jsx"
import Auth from "./pages/Auth.jsx"

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Auth/>}/>

            <Route path="/" element={<MainLayout />} >
                <Route index element={<Dashboard />} />
                <Route path="discover" element={<Discover />} />
                <Route path="my-playlists" element={<Playlists />} />
                <Route path="create-new" element={<Create />} />
            </Route>
        </Routes>
    );
}

export default App