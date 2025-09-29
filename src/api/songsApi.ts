export interface AlbumShortDto {
    spotifyId?: string | null
    name: string
    coverImageUrl?: string | null
    artist?: string | null
}

export interface SongDto {
    spotifyId: string
    title: string
    coverImageUrl?: string
    songLengthInSeconds?: number
    releaseDate?: string
    artist?: string
    album?: AlbumShortDto
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

export async function getRecommendedSongs(): Promise<SongDto[]> {
    const res = await fetch(`${API_BASE}/api/Recommendation/songs`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch recommended songs: ${res.status} ${text}`)
    }

    const data = await res.json()
    return data as SongDto[]
}

export async function getAllSongs(): Promise<SongDto[]> {
    const res = await fetch(`${API_BASE}/api/Song/all`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch songs: ${res.status} ${text}`)
    }

    const data = await res.json()
    return data as SongDto[]
}

export async function getSongById(songId: string): Promise<SongDto> {
    const res = await fetch(`${API_BASE}/api/Song/${songId}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch song: ${res.status} ${text}`)
    }

    const data = await res.json()
    return data.result as SongDto
}