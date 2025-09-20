import vinyl from "../assets/icons/vinyl.svg"
import FeaturedButton from "../components/ui/FeaturedButton.tsx"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../app/hooks.ts"

const NotFound = () => {
    const navigate = useNavigate()
    const status = useAppSelector(s => s.auth.status)

    const handleClick = () => {
        if (status === "authenticated") {
            navigate("/")
        } else {
            navigate("/login")
        }
    }

    return (
        <div className="bg-bg-primary w-screen min-h-screen flex flex-col items-center justify-center">
            <h1 className="xl:text-[160px] md:text-[100px] text-4xl flex gap-3 mb-2">
                4
                <img src={ vinyl } alt="Vinyl record representing the number zero" className="xl:w-[160px] md:w-[100px] w-[70px]" />
                4
            </h1>

            <p className="font-text xl:text-s md:text-xs text-2xs text-primary-60 mb-12 text-center">
                The page you are looking for do not exist :(
            </p>

            <FeaturedButton text="Go back" onClick={ handleClick } />
        </div>
    )
}

export default NotFound