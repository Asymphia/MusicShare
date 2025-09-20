import { Outlet } from "react-router-dom"
import Nav from "../components/layout/Nav.tsx"
import Main from "../components/layout/Main.tsx"
import Player from "../components/layout/Player.tsx"
import SearchBar from "../components/ui/SearchBar.tsx"
import { useEffect, useState } from "react"
import MobileNav from "../components/layout/MobileNav.tsx"

const MainLayout = () => {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, [])

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