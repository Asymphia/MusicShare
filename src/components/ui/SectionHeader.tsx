import clsx from "clsx"
import type { ReactNode } from "react"

interface SectionHeaderProps {
    title: string
    right?: ReactNode
    className?: string
    as?: "h1" | "h2" | "h3" | "h4"
}

const SectionHeader = ({ title, right, className = "", as: Heading = "h3" }: SectionHeaderProps) => {
    const HeaderTag = Heading

    return (
        <div className={clsx("flex items-center justify-between mb-4", className)}>
            <HeaderTag>
                { title }
            </HeaderTag>

            {
                right && (
                    <div className="flex items-center space-x-3">
                        { right }
                    </div>
                )
            }
        </div>
    )
}

export default SectionHeader