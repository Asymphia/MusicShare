import {type ForwardedRef, forwardRef, type RefObject} from "react"
import stars from "../../assets/icons/auth-stars.png"

interface AuthHeaderProps {
    starRef: RefObject<HTMLImageElement | null>
}

const AuthHeader = forwardRef(({ starRef }: AuthHeaderProps, headerRef: ForwardedRef<HTMLSpanElement>) => {
    return (
        <h1 className="font-header font-semibold text-2xl md:text-3xl xl:text-4xl text-primary max-w-[90%] md:max-w-[60%] xl:max-w-[51%] text-center">
                <span ref={headerRef}>
                    <span className="text-accent-2">
                        Connect to Spotify to unlock
                    </span>
                    &nbsp;our features
                </span>
            <img ref={starRef} src={stars} alt="stars" className="inline-block ml-3 md:ml-4 xl:ml-6 w-8 md:w-10 xl:w-13"/>
        </h1>
    )
})

export default AuthHeader