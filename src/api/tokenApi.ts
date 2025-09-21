import { type TokenResponse } from "../features/auth/types.ts"

const API_BASE = "/api/Token"
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

export async function postToken(token: TokenResponse): Promise<TokenResponse> {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(token)
    })

    if(!res.ok) throw new Error("Failed to post token")

    return res.json()
}

export async function getToken(): Promise<TokenResponse> {
    const res = await fetch(API_BASE, {
        method: "GET",
        headers: { Accept: "application/json" }
    })

    if(!res.ok) throw new Error("Failed to get token")

    return res.json()
}

export async function putToken(token: Partial<TokenResponse>): Promise<TokenResponse> {
    const res = await fetch(API_BASE, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(token)
    })

    if(!res.ok) throw new Error("Failed to update token in database")

    return res.json()
}

export async function isTokenValid(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/isTokenValid`)

    if(!res.ok) return false

    const data = await res.json()

    return Boolean(data)
}

export async function deleteToken(): Promise<void> {
    const res = await fetch(API_BASE, { method: "DELETE" })

    if(!res.ok) throw new Error("Failed to delete token")
}

export async function refreshAccessToken(refreshToken: string): Promise<any>{
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: CLIENT_ID || "",
        client_secret: CLIENT_SECRET
    })

    const res = await fetch(SPOTIFY_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
    })

    const text = await res.text()

    if(!res.ok) {
        throw new Error(`Failed to refresh Spotify token: ${res.status} ${text}`)
    }

    const data = JSON.parse(text)
    return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? refreshToken,
        expiresIn: data.expires_in,
        tokenType: data.token_type,
        scope: data.scope,
        hasRefreshToken: Boolean(data.refresh_token ?? refreshToken)
    }
}