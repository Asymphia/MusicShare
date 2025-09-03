export interface PlaylistDto {
    id: number
    spotifyId: string
    name: string
    coverImageUrl?: string | null
}

const API_BASE = import.meta.env.VITE_API_BASE

export async function getAllPlaylists(): Promise<PlaylistDto[]> {
    const res = await fetch(`${API_BASE}/api/playlist`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch playlists: ${res.status} ${text}`)
    }

    const data = await res.json()
    return data as PlaylistDto[]
}