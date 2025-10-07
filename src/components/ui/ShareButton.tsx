import Icon from "./Icon"
import useWindowWidth from "../../hooks/useWindowWidth"
import {useEffect, useRef, useState} from "react"
import gsap from "gsap"

interface ShareButtonProps {
    text: string
}

const ShareButton = ({ text }: ShareButtonProps) => {
    const width = useWindowWidth()

    const [copied, setCopied] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const popupRef = useRef<HTMLDivElement>(null)

    const handleCopy = () => {
        setError(false)
        setCopied(true)

        navigator.clipboard.writeText(text)
            .then(() => setCopied(true))
            .catch(() => setError(true))

        setTimeout(() => {
            if (popupRef.current) {
                gsap.to(popupRef.current, {
                    opacity: 0,
                    y: 10,
                    duration: 0.2,
                    ease: "power2.in",
                    onComplete: () => {
                        setCopied(false)
                        setError(false)
                    }
                })
            }
        }, 2000)
    }

    useEffect(() => {
        if(popupRef.current) {
            if(copied || error) {
                gsap.fromTo(
                    popupRef.current,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
                )
            }
        }
    }, [copied, error])

    return (
        <div className="relative">
            <button type="button" className="cursor-pointer" onClick={ handleCopy }>
                <Icon name="share" size={ width >= 1280 ? 19 : width >= 768 ? 17 : 15 }
                      className="xl:w-[19px] xl:h-[19px] md:w-[17px] md:h-[17px] w-[15px] h-[15px] fill-primary-60 hover:fill-primary-80 active:fill-primary"/>
            </button>

            {
                (copied || error) && (
                    <div ref={ popupRef } className="absolute bg-bg-primary p-2 rounded-2xl min-w-fit font-text text-xs text-primary whitespace-nowrap mt-1 left-1/2 -translate-x-1/2 x-20">
                        { copied && "Copied!" }
                        { error && "Failed to copy." }
                    </div>
                )
            }
        </div>

    )
}

export default ShareButton