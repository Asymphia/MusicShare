import AuthButton from "../components/auth/AuthButton.tsx"
import AuthHeader from "../components/auth/AuthHeader.tsx"
import spotify from "../assets/icons/spotify.svg"
import { useRef, useLayoutEffect } from 'react'

import { gsap } from 'gsap'
import { SplitText } from "gsap/SplitText"

const Auth = () => {
    const headerRef = useRef<HTMLSpanElement>(null)
    const starRef = useRef<HTMLImageElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)
    let splitInstance = useRef<SplitText | null>(null)


    useLayoutEffect(() => {
        gsap.registerPlugin(SplitText);
        splitInstance.current = new SplitText(headerRef.current, { type: 'words' });

        gsap.set(splitInstance.current.words, { y: -100, opacity: 0 })
        gsap.set(starRef.current, { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' })
        gsap.set(buttonRef.current, { y: 40, opacity: 0 })

        const tl = gsap.timeline()

        tl.to(splitInstance.current.words, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            stagger: 0.15,
        })

        tl.to(starRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
        }, '+=0.1')

        tl.to(buttonRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
        }, '+=0.1')

        return () => {
            splitInstance.current?.revert()
            tl.kill()
        }
    }, [])

    return (
        <div className="w-screen h-screen bg-bg-primary flex justify-center items-center flex-col space-y-8 md:space-y-10 xl:space-y-16">
            <AuthHeader ref={headerRef} starRef={starRef} />
            <AuthButton ref={buttonRef} text="Connect to Spotify" icon={spotify} alt="Spotify icon" onClick={() => {}} />
        </div>
    )
}

export default Auth