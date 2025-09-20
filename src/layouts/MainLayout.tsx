import { Outlet } from "react-router-dom"
import Nav from "../components/layout/Nav.tsx"
import Main from "../components/layout/Main.tsx"
import Player from "../components/layout/Player.tsx"
import SearchBar from "../components/ui/SearchBar.tsx"
import MobileNav from "../components/layout/MobileNav.tsx"
import useWindowWidth from "../hooks/useWindowWidth.ts"

const MainLayout = () => {
    const width = useWindowWidth()

    return (
        <div className="bg-bg-primary w-screen h-screen flex flex-col">
            <div className="flex flex-1 overflow-hidden">
                { width >= 1280 &&  <Nav /> }
                <Main>
                    <SearchBar />
                    <Outlet />
                </Main>
            </div>
            <Player />
            { width < 1280 &&  <MobileNav /> }
        </div>
    )
}

export default MainLayout