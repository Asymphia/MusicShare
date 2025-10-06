export interface featuredDto {
    spotifyId: string
    title: string
    artist: string
    artistSpotifyId: string
    albumName: string
    albumId: string
    isDraft: boolean
    coverImageUrl?: string | null
    songLengthInSeconds?: number | null
    localSongPath?: string | null
    releaseDate?: string | null
    created_at?: string | null
    updated_at?: string | null
    hasLocalFile: boolean
    isComplete: boolean
    displayArtist?: string | null
    displayAlbum?: string | null
}

const API_BASE = import.meta.env.VITE_API_BASE

export async function getFeatured(): Promise<featuredDto>  {
    const res = await fetch(`${API_BASE}/api/Recommendation/recomendedSongBigBanner`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch featured data: ${res.status} ${text}`)
    }

    return await res.json() as Promise<featuredDto>
}