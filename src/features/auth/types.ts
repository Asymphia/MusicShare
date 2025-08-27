export interface TokenResponse {
    id?: number
    accessToken: string
    refreshToken: string
    expiresIn: number
    expiresAt?: string
    tokenType?: string
    scope?: string
    state?: string
    hasRefreshToken?: boolean
}