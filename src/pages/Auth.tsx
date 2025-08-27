import AuthButton from "../components/auth/AuthButton.tsx"
import AuthHeader from "../components/auth/AuthHeader.tsx"
import spotify from "../assets/icons/spotify.svg"
import { useRef, useLayoutEffect } from 'react'

import { gsap } from 'gsap'
import { SplitText } from "gsap/SplitText"
import {buildAuthUrl, createCodeChallenge, createCodeVerifier} from "../lib/oath.ts"

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = (import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string) || `${window.location.origin}/auth/callback`

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


    const handleConnect = async () => {
        if(!CLIENT_ID) {
            console.error("Missing VITE_SPOTIFY_CLIENT_ID env var")
            return
        }

        const codeVerifier = createCodeVerifier()
        const codeChallenge = await createCodeChallenge(codeVerifier)

        sessionStorage.setItem("pkce_code_verifier", codeVerifier)

        const authUrl = buildAuthUrl({
            clientId: CLIENT_ID,
            redirectUri: REDIRECT_URI,
            codeChallenge,
            scope: "user-read-private user-read-email playlist-read-private playlist-modify-private"
        })

        window.location.assign(authUrl)
    }

    return (
        <div className="w-screen h-screen bg-bg-primary flex justify-center items-center flex-col space-y-8 md:space-y-10 xl:space-y-16">
            <AuthHeader ref={headerRef} starRef={starRef} />
            <AuthButton ref={buttonRef} text={ status === "loading" ? "Connecting..." : "Connect to Spotify" } icon={spotify} alt="Spotify icon" onClick={handleConnect} />
        </div>
    )
}

export default Auth