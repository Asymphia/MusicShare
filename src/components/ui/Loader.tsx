import { useEffect, useMemo, useRef } from "react"
import gsap from "gsap"

interface LoaderProps {
    size?: number
    stroke?: number
    color?: string
}

const Loader = ({ size = 70, stroke = 4, color = "#707997" }: LoaderProps) => {
    const rootRef = useRef<HTMLDivElement | null>(null)
    const ring1Ref = useRef<SVGGElement | null>(null)
    const ring2Ref = useRef<SVGGElement | null>(null)
    const ring3Ref = useRef<SVGGElement | null>(null)

    const cx = size / 2

    const {
        r1, r2, r3,
        c1, c2, c3,
        dash1, dash2, dash3
    } = useMemo(() => {
        const rings = 3
        const available = cx - stroke
        const minInner = stroke + 0.5

        const desiredGapPx = 6
        const desiredStep = 2 * stroke + desiredGapPx

        const maxStep = (available - minInner) / (rings - 1)

        const step = Math.max(1, Math.min(desiredStep, maxStep))

        const r1 = Math.max(stroke, available)
        const r2 = Math.max(stroke, r1 - step)
        const r3 = Math.max(stroke, r2 - step)

        const c1 = 2 * Math.PI * r1
        const c2 = 2 * Math.PI * r2
        const c3 = 2 * Math.PI * r3

        const dash1 = Math.round(Math.PI * r1 * 1.5)
        const dash2 = Math.round(Math.PI * r2)
        const dash3 = Math.round(Math.PI * r3 * 0.9)

        return { r1, r2, r3, c1, c2, c3, dash1, dash2, dash3 }
    }, [cx, stroke])

    useEffect(() => {
        if (!rootRef.current) return
        const ctx = gsap.context(() => {

            if (ring1Ref.current) {
                gsap.to(ring1Ref.current, {
                    rotation: 360,
                    svgOrigin: `${cx} ${cx}`,
                    duration: 1.6,
                    ease: "none",
                    repeat: -1
                })
            }

            if (ring2Ref.current) {
                gsap.to(ring2Ref.current, {
                    rotation: -360,
                    svgOrigin: `${cx} ${cx}`,
                    duration: 2.1,
                    ease: "none",
                    repeat: -1
                })
            }

            if (ring3Ref.current) {
                gsap.to(ring3Ref.current, {
                    rotation: 360,
                    svgOrigin: `${cx} ${cx}`,
                    duration: 2.9,
                    ease: "none",
                    repeat: -1
                })
            }
        }, rootRef)

        return () => ctx.revert()
    }, [cx])

    return (
        <div ref={rootRef} className="flex items-center justify-center" role="status" aria-label="Loading">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
                <g ref={ring1Ref}>
                    <circle cx={cx} cy={cx} r={r1} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
                            strokeDasharray={`${dash1} ${c1}`} />
                </g>

                <g ref={ring2Ref}>
                    <circle cx={cx} cy={cx} r={r2} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
                            strokeDasharray={`${dash2} ${c2}`} opacity={0.6} />
                </g>

                <g ref={ring3Ref}>
                    <circle cx={cx} cy={cx} r={r3} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
                            strokeDasharray={`${dash3} ${c3}`} opacity={0.4} />
                </g>
            </svg>
        </div>
    )
}

export default Loader