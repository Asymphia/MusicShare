import { type TokenResponse } from "../features/auth/types.ts"

const API_BASE = "/api/Token"

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