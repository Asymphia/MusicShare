import { Link, useLocation } from "react-router-dom"
import star from "../../assets/icons/star-white.svg"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import gsap from "gsap"

interface NavItemProps {
    text: string
    link: string
}

const NavItem = ({ text, link }: NavItemProps) => {
    const location = useLocation()
    const [style, setStyle] = useState("text-accent-2 transition hover:text-primary")
    const starRef = useRef(null)
    const textRef = useRef(null)

    useEffect(() => {
        if(location.pathname === link){
            setStyle("text-primary")

            starRef.current && gsap.to(starRef.current, { x: 0, opacity: 1, duration: .2, ease: "power2.out" })
            textRef.current && gsap.to(textRef.current, { x: 0, duration: .2, ease: "power2.out" })

        } else {
            setStyle("text-accent-2 hover:text-primary")

            starRef.current && gsap.to(starRef.current, { x: -20, opacity: 0, duration: .2, ease: "power2.in" })
            textRef.current && gsap.to(textRef.current, { x: -26, duration: .2, ease: "power2.in" })
        }
    }, [location, link])

    return (
        <Link to={link} className={clsx(`font-text text-m space-x-2 transition ${style}`, location.pathname === link && "pointer-events-none cursor-not-allowed")}>
            <img ref={starRef} src={star} alt="star" className="inline-block w-5 h-5 -translate-x-[20px] opacity-0 "/>
            <span ref={textRef} className="inline-block -translate-x-[26px]"> {text} </span>
        </Link>
    )
}

export default NavItem