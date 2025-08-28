import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../app/hooks"
import { saveTokenToApi } from "../features/auth/authSlice"
import type { TokenResponse } from "../features/auth/types"
import {createCodeChallenge} from "../lib/oauth.ts"

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div>
                    <p className="text-center">Completing sign-in with Spotify…</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-lg w-full bg-white/5 p-6 rounded-md shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Authentication error</h2>
                    <p className="mb-4 break-words">{error}</p>
                    <div className="flex gap-2">
                        <button
                            className="px-4 py-2 rounded bg-primary text-white"
                            onClick={() => {
                                navigate("/login")
                            }}
                        >
                            Try again
                        </button>
                        <button
                            className="px-4 py-2 rounded border"
                            onClick={() => {
                                sessionStorage.removeItem("pkce_code_verifier")
                                navigate("/", { replace: true })
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default SpotifyCallback