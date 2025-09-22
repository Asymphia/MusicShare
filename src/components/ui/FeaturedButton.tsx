import { type MouseEventHandler, useRef } from "react"
import { gsap } from "gsap"
import Icon, { type IconName } from "./Icon.tsx"
import clsx from "clsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"

interface FeaturedButtonProps {
    text: string,
    icon?: IconName
    onClick?: () => void
    className?: string
}

const FeaturedButton = ({ text, icon, onClick, className }: FeaturedButtonProps) => {
    const btnRef = useRef<HTMLButtonElement | null>(null)

    const handleMouseEnter = () => {
        gsap.to(btnRef.current, {
            scale: 1.02,
            duration: 0.2,
            ease: "power2.out",
        })
    }

    const handleMouseLeave = () => {
        gsap.to(btnRef.current, {
            background: "radial-gradient(circle at 0% 0%, #D9D9D999, #D9D9D999)",
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
        })
    }

    const handleMouseMove: MouseEventHandler<HTMLButtonElement> = (e) => {
        const el = btnRef.current
        if (!el) return

        const rect = el.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        const gradient = `radial-gradient(circle at ${x}% ${y}%, #D9D9D9aa, #D9D9D933)`
        gsap.to(btnRef.current, {
            background: gradient,
            duration: 0.2,
            ease: "power2.out",
        })
    }

    const handleMouseDown = () => {
        gsap.to(btnRef.current, {
            scale: 0.95,
            duration: 0.2,
            ease: "power1.inOut",
        })
    }

    const handleMouseUp = () => {
        gsap.to(btnRef.current, {
            scale: 1.02,
            duration: 0.2,
            ease: "power1.inOut",
        })
    }

    const width = useWindowWidth()

    return (
        <button
            type="button"
            ref={btnRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={onClick}
            className={clsx("xl:px-12 md:px-10 px-8 md:py-3 py-2 text-primary rounded-full font-text xl:text-s md:text-xs text-2xs flex items-center md:gap-3 gap-2 cursor-pointer", className)}
            style={{ background: "radial-gradient(circle at 0% 0%, #D9D9D999, #D9D9D999)" }}
        >
            {
                icon && <Icon name={ icon } size={ width >= 768 ? 12 : 8 } className="fill-primary md:w-3 md:h-3 w-2 h-2" />
            }
            { text }
        </button>
    )
}

export default FeaturedButton