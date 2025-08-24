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
        <div className={clsx("space-x-3", className)}>
            <Icon name={ icon } className={clsx("inline-block", iconClassName)} />
            <span className={clsx("font-text text-primary-60 text-xs inline-block", textClassName)}>
                { text }
            </span>
        </div>
    )
}

export default TextWithIcon