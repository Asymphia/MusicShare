import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../app/hooks"
import { saveTokenToApi } from "../features/auth/authSlice"
import type { TokenResponse } from "../features/auth/types"
import { createCodeChallenge } from "../lib/oauth.ts"
import Loader from "../components/ui/Loader.tsx"
import bug from "../assets/icons/bug.svg"
import FeaturedButton from "../components/ui/FeaturedButton.tsx"

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string

const SpotifyCallback: React.FC = () => {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const didRunRef = useRef(false)

    useEffect(() => {
        if(didRunRef.current) return
        didRunRef.current = true

        ;(async () => {
            try {
                const params = new URLSearchParams(window.location.search)
                const code = params.get("code")
                const err = params.get("error")

                if (err) throw new Error(`Spotify auth error: ${err}`)
                if (!code) throw new Error("Authorization code not found in callback URL")

                const codeVerifier = sessionStorage.getItem("pkce_code_verifier")
                if (!codeVerifier) throw new Error("PKCE code verifier missing from sessionStorage")

                const savedChallenge = sessionStorage.getItem("pkce_code_challenge")
                if (!savedChallenge) throw new Error("PKCE code challenge missing from sessionStorage")

                const recomputed = await createCodeChallenge(codeVerifier)

                if(savedChallenge && recomputed !== savedChallenge) {
                    throw new Error("PKCE mismatch.")
                }

                const body = new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: REDIRECT_URI,
                    client_id: CLIENT_ID || "",
                    code_verifier: codeVerifier,
                })

                const res = await fetch("https://accounts.spotify.com/api/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: body.toString(),
                })

                if (!res.ok) {
                    const text = await res.text()
                    throw new Error(`Failed to exchange code: ${res.status} ${text}`)
                }

                const data = await res.json()

                const token: TokenResponse = {
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    expiresIn: data.expires_in,
                    tokenType: data.token_type,
                    scope: data.scope,
                    hasRefreshToken: Boolean(data.refresh_token)
                }

                await dispatch(saveTokenToApi(token))

                sessionStorage.removeItem("pkce_code_verifier")
                sessionStorage.removeItem("pkce_code_challenge")

                console.log("SpotifyCallback: navigation to /")
                setLoading(false)

                navigate("/", { replace: true })
            } catch (e: any) {
                console.error("SpotifyCallback error:", e)
                sessionStorage.removeItem("pkce_code_verifier")
                sessionStorage.removeItem("pkce_code_challenge")
                setError(e?.message || String(e))
                setLoading(false)
            }
        })()
    }, [dispatch, navigate])

    const [dots, setDots] = useState(1)

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev === 3 ? 1 : prev + 1))
        }, 500)

        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary">
                <Loader />
                <p className="text-center font-text text-primary xl:text-s md:text-xs text-2xs mt-3">
                    Completing sign-in with Spotify{".".repeat(dots)}
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary">
                <div className="w-fit xl:max-w-1/3 md:max-w-1/2 max-w-full bg-bg-secondary rounded-2xl p-8 mx-2">
                    <img src={ bug } className="xl:w-22 md:w-18 w-16 mx-auto mb-8" />
                    <h2 className="mb-4 text-center">
                        An error ocured during auth proccess
                    </h2>
                    <p className="text-primary-60 font-text xl:text-s md:text-xs text-2xs">
                        { error }
                    </p>
                    <div className="grid md:grid-cols-2 grid-cols-1 md:gap-6 gap-4 mt-8">
                        <FeaturedButton text="Try again" className="!block text-center" onClick={() => navigate("/login")} />
                        <FeaturedButton text="Cancel" className="!block text-center" onClick={() => { sessionStorage.removeItem("pkce_code_verifier"); navigate("/", { replace: true }) }} />
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default SpotifyCallback