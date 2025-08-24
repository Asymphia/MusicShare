import { type MouseEventHandler, useRef } from "react"
import { gsap } from "gsap"
import Icon, { type IconName } from "./Icon.tsx"

interface FeaturedButtonProps {
    text: string,
    icon: IconName
}

const FeaturedButton = ({ text, icon }: FeaturedButtonProps) => {
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

    return (
        <button
            ref={btnRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className="px-12 py-3 text-primary rounded-full font-text text-s flex items-center gap-3 cursor-pointer"
            style={{ background: "radial-gradient(circle at 0% 0%, #D9D9D999, #D9D9D999)" }}
        >
            <Icon name={icon} className="fill-primary w-3 h-3" />
            { text }
        </button>
    )
}

export default FeaturedButton