import { Outlet } from "react-router-dom"
import Nav from "../components/layout/Nav.tsx"
import Main from "../components/layout/Main.tsx"
import Player from "../components/layout/Player.tsx"
import SearchBar from "../components/ui/SearchBar.tsx"

const MainLayout = () => {
    return (
        <div className="bg-bg-primary w-screen h-screen flex flex-col">
            <div className="flex flex-1 overflow-hidden">
                <Nav />
                <Main>
                    <SearchBar />
                    <Outlet />
                </Main>
            </div>
            <Player />
        </div>
    )
}

export default MainLayout