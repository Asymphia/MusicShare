import { forwardRef, type MouseEvent, type ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react"
import gsap from "gsap"
import { createPortal } from "react-dom"

interface PopupProps {
    isOpen: boolean
    close: () => void
    portalContainer?: HTMLElement | null
    children?: ReactNode
}

export type PopupHandle = {
    close: () => void
}

const Popup = forwardRef<PopupHandle, PopupProps>(({ isOpen, close, portalContainer = null, children }, ref) => {
    const [render, setRender] = useState<boolean>(isOpen)

    const overlayRef = useRef<HTMLDivElement | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)
    const containerRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if(portalContainer) {
            containerRef.current = portalContainer
        } else if (typeof document !== "undefined") {
            containerRef.current = document.body
        }
    }, [portalContainer])

    useImperativeHandle(ref, () => ({
        close: () => close()
    }), [close])

    useEffect(() => {
        if(isOpen) {
            setRender(true)

            requestAnimationFrame(() => {
                if(panelRef.current) {
                    gsap.killTweensOf(panelRef.current)
                    gsap.fromTo(panelRef.current,
                        { autoAlpha: 0, y: -8 },
                        { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }
                    )
                }
            })

            if(overlayRef.current) {
                gsap.killTweensOf(overlayRef.current)
                gsap.fromTo(overlayRef.current,
                    { autoAlpha: 0, y: -8 },
                    { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }
                )
            }
        } else if (render) {
            if(panelRef.current || overlayRef.current) {
                const tl = gsap.timeline({
                    onComplete: () => setRender(false)
                })

                if(panelRef.current) {
                    tl.to(panelRef.current, {
                        autoAlpha: 0, y: -8, duration: 0.18, ease: "power2.in"
                    })
                }

                if(overlayRef.current) {
                    tl.to(overlayRef.current, {
                        autoAlpha: 0, y: -8, duration: 0.18, ease: "power2.in"
                    }, 0)
                }
            }
        } else {
            setRender(false)
        }
    }, [isOpen, render])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if(e.key === "Escape") close()
        }

        if (render) {
            window.addEventListener("keydown", onKey)
            return () => window.removeEventListener("keydown", onKey)
        }
    }, [render, close])

    const handleOverlayMouseDown = (e: MouseEvent) => {
        if(e.target === overlayRef.current) {
            close()
        }
    }

    if(!render || !containerRef.current) return null

    return createPortal(
        <div ref={overlayRef} onMouseDown={handleOverlayMouseDown} className="fixed inset-0 z-50 flex items-start justify-center p-9" aria-hidden={!isOpen} style={{ background: "rgba(6,6,8,0.3)" }}>
            <div ref={panelRef} role="dialog" aria-modal="true" className="bg-bg-primary p-8 rounded-3xl w-full max-w-[460px] shadow-2xl space-y-8" onMouseDown={e => e.stopPropagation()}>
                { children }
            </div>
        </div>,
        containerRef.current
    )
})

export default Popup