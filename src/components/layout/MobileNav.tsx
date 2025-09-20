import Icon from "../ui/Icon.tsx";
import {Link} from "react-router-dom";

const MobileNav = () => {
    const navItems = [
        { name: "Main", link: "/", icon: "dashboard" },
        { name: "Playlists", link: "/playlists", icon: "playlist" },
        { name: "Create new", link: "/create-new", icon: "create" },
    ]

    return (
        <nav className="flex justify-center md:gap-10 gap-6 py-2">
            {
                navItems.map(item => (
                    <Link to={ item.link } key={ item.link } className="flex flex-col items-center font-text md:text-2xs text-4xs transition text-primary-60 hover:text-primary-80 active:text-primary">
                        <Icon name={ item.icon } className={`${ item.name === "Main" || item.name === "Create new" ? "fill-primary stroke-none" : "!fill-none !stroke-primary" } md:w-7 md:h-7 w-5 h-5 mb-1`} />
                        <p>{ item.name }</p>
                    </Link>
                ))
            }
        </nav>
    )
}

export default MobileNav