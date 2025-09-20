import Icon, { type IconName } from "./Icon.tsx"
import clsx from "clsx"

interface TextWithIconProps {
    text: string
    icon: IconName
    iconClassName?: string
    className?: string
    textClassName?: string
}

const TextWithIcon = ({ text, icon, iconClassName, textClassName, className }: TextWithIconProps) => {
    return (
        <div className={clsx("md:space-x-3 sm:space-x-2 space-x-1", className)}>
            <Icon size={ 20 } name={ icon } className={clsx("inline-block", iconClassName)} />
            <span className={clsx("font-text text-primary-60 md:text-xs sm:text-2xs text-2xs inline-block", textClassName)}>
                { text }
            </span>
        </div>
    )
}

export default TextWithIcon