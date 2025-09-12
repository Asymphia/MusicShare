import bug from "../../assets/icons/bug.svg"
import FeaturedButton from "./FeaturedButton.tsx"
import clsx from "clsx"

interface ErrorProps {
    text: string
    handleRetry: () => void
    mainClassName?: string
    buttonClassName?: string
}

const Error = ({ text, handleRetry, mainClassName = "", buttonClassName = "" }: ErrorProps) => {
    return (
        <div className={clsx("font-text text-primary-60 text-xs", mainClassName)}>
            <div className="flex flex-nowrap items-center gap-3 mb-3">
                <img src={ bug } className="w-6" alt="Error"/>
                Failed to load { text } :(
            </div>

            <FeaturedButton text="Retry" className={ buttonClassName } onClick={ handleRetry } />
        </div>
    )
}

export default Error