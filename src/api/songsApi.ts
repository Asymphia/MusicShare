export interface SongDto {
    spotifyId: string
    title: string
    coverImageUrl: string
    songLengthInSeconds?: number
    releaseDate?: string
    artist?: string
    album?: string
}

export interface topSongsDto {
    id: number
    songs: SongDto[]
}

const API_BASE = import.meta.env.VITE_API_BASE

export async function getTopSongs(take: number): Promise<topSongsDto> {
    const res = await fetch(`${API_BASE}/api/ListeningHistory/top-song?top=${take}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch top songs: ${res.status} ${text}`)
    }

    const raw = await res.json()
    const dto: topSongsDto = {
        id: raw.id,
        songs: raw.result ?? []
    }
    return dto
}