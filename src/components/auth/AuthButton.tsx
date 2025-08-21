import { type ForwardedRef, forwardRef } from "react"

interface AuthButtonProps {
    text: string
    icon: string
    alt: string
    onClick: () => void
}

const AuthButton = forwardRef(({ text, icon, alt, onClick } : AuthButtonProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref}>
            <button
                onClick={onClick}
                className="border-solid border border-accent shadow-inner rounded-5xl flex flex-nowrap items-center space-x-4 px-5 md:px-7 xl:px-11 py-2 md:py-3 xl:py-7
                bg-gradient-to-r from-accent-20 to-bg-primary-20 cursor-pointer transition
                hover:bg-accent-20 hover:border-primary-80 active:bg-accent-60 active:border-primary"
            >
            <span className="font-text font-semibold text-m md:text-l xl:text-3xl bg-gradient-to-b from-primary to-accent bg-clip-text text-transparent">
                { text }
            </span>
                <img src={icon} alt={alt} className="w-7 md:w-9 xl:w-11" />
            </button>
        </div>
    )
})

export default AuthButton