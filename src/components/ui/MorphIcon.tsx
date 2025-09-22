import { useEffect, useRef } from "react"
import gsap from "gsap"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"

gsap.registerPlugin(MorphSVGPlugin)

interface MorphIconProps {
    isChecked: boolean
    size?: number
    className?: string
}

const MorphIcon = ({ isChecked, size = 16, className = "" }: MorphIconProps) => {
    const pathRef = useRef<SVGPathElement>(null)

    const plusPath = "M13.125 6.125H7.875V0.875C7.875 0.39375 7.48125 0 7 0C6.51875 0 6.125 0.39375 6.125 0.875V6.125H0.875C0.39375 6.125 0 6.51875 0 7C0 7.48125 0.39375 7.875 0.875 7.875H6.125V13.125C6.125 13.6062 6.51875 14 7 14C7.48125 14 7.875 13.6062 7.875 7.875V7.875H13.125C13.6062 7.875 14 7.48125 14 7C14 6.51875 13.6062 6.125 13.125 6.125Z"

    const checkPath = "M11.8748 4.06388L11.0834 3.27444C11.0303 3.21957 10.9667 3.17595 10.8964 3.14616C10.826 3.11637 10.7505 3.10101 10.6741 3.10101C10.5977 3.10101 10.5221 3.11637 10.4518 3.14616C10.3815 3.17595 10.3179 3.21957 10.2648 3.27444L5.62145 7.91971L3.73339 6.02777C3.62435 5.92089 3.47775 5.86102 3.32506 5.86102C3.17237 5.86102 3.02577 5.92089 2.91673 6.02777L2.12728 6.81916C2.07242 6.87228 2.02879 6.93589 1.999 7.0062C1.96921 7.07651 1.95386 7.1521 1.95386 7.22846C1.95386 7.30483 1.96921 7.38042 1.999 7.45073C2.02879 7.52104 2.07242 7.58465 2.12728 7.63777L5.21311 10.7255C5.26552 10.781 5.32886 10.8251 5.39915 10.8549C5.46943 10.8847 5.54512 10.8995 5.62145 10.8986C5.6974 10.8989 5.77261 10.8837 5.84249 10.854C5.91237 10.8242 5.97544 10.7805 6.02784 10.7255L11.8709 4.89221C11.9258 4.8391 11.9694 4.77549 11.9992 4.70517C12.029 4.63486 12.0443 4.55927 12.0443 4.48291C12.0443 4.40654 12.029 4.33096 11.9992 4.26064C11.9694 4.19033 11.9258 4.12672 11.8709 4.0736L11.8748 4.06388Z"



    useEffect(() => {
        if(pathRef.current) {
            gsap.to(pathRef.current, {
                duration: 0.2,
                morphSVG: isChecked ? checkPath : plusPath,
                ease: "power2.inOut"
            })
        }
    }, [isChecked])

    return (
        <svg width={size} height={size} viewBox="0 0 14 14" fill="none"
             xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                ref={pathRef}
                d={plusPath}
            />
        </svg>
    )
}

export default MorphIcon