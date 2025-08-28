const SPOTIFY_AUTHORIZE_BASE = "https://accounts.spotify.com/authorize"
const VERIFIER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"

function randomVerifier(length = 128) {
    const finalLen = Math.max(43, Math.min(128, length))
    const array = new Uint8Array(finalLen)
    crypto.getRandomValues(array)
    let s = ""
    for (let i = 0; i < finalLen; i++) {
        // map byte -> index in VERIFIER_CHARS
        s += VERIFIER_CHARS.charAt(array[i] % VERIFIER_CHARS.length)
    }
    return s
}

function base64UrlEncode(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    const b64 = btoa(binary)
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export async function createCodeChallenge(codeVerifier: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const digest = await crypto.subtle.digest("SHA-256", data)
    return base64UrlEncode(digest)
}

export function createCodeVerifier(length = 128) {
    return randomVerifier(length)
}

export function buildAuthUrl(options: {
    clientId: string
    redirectUri: string
    scope?: string
    state?: string
    codeChallenge: string
}) {
    const { clientId, redirectUri, scope = "", state, codeChallenge } = options
    if (!clientId) throw new Error("clientId is required to build Spotify auth URL")
    if (!codeChallenge) throw new Error("codeChallenge is required to build Spotify auth URL")

    const url = new URL(SPOTIFY_AUTHORIZE_BASE)
    url.searchParams.set("client_id", clientId)
    url.searchParams.set("response_type", "code")
    url.searchParams.set("redirect_uri", redirectUri)
    url.searchParams.set("code_challenge_method", "S256") // MUST be exactly S256
    url.searchParams.set("code_challenge", codeChallenge)
    if (scope) url.searchParams.set("scope", scope)
    if (state) url.searchParams.set("state", state)
    return url.toString()
}