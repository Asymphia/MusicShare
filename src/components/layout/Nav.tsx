import hamburger from "../../assets/icons/hamburger.svg"
import NavItem from "./NavItem.tsx"
import User from "./User.tsx"

const Nav = () => {
    const navItems = [
        { name: "Main", link: "/" },
        { name: "Playlists", link: "/playlists" },
        { name: "Albums", link: "/albums" },
        { name: "Create new", link: "/create-new" },
    ]

    return (
        <aside className="w-47 flex flex-col justify-between px-4 py-8">
            <div>
                <img src={ hamburger } alt="menu" className="w-7"/>

                <nav className="flex flex-col space-y-4 mt-39">
                    {
                        navItems.map(item => (
                            <NavItem text={item.name} link={item.link} key={`NavItem${item.link}`} />
                        ))
                    }
                </nav>
            </div>
            <User />
        </aside>
    )
}

export default Nav