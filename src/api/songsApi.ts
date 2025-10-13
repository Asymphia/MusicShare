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
    localSongPath?: string | null
    hasLocalSong?: boolean
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

export async function postSongFile(songId: string, file: File, duration: number): Promise<void> {
    const fd = new FormData()
    fd.append("songToAdd", file, file.name)

    const res = await fetch(`${API_BASE}/api/Song/Files/${songId}?duration=${duration}`, {
        method: "POST",
        body: fd,
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to post file: ${res.status} ${text}`)
    }
}

export async function deleteSongFile(songId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/Song/Files/${songId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to delete song file: ${res.status} ${text}`)
    }
}

export async function putSong(songId: string, songBody: Partial<SongDto>): Promise<SongDto> {
    const res = await fetch(`${API_BASE}/api/Song?spotifyId=${encodeURIComponent(songId)}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(songBody)
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to put song: ${res.status} ${text}`)
    }

    const contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
        return { ...(songBody as SongDto), spotifyId: songId } as SongDto
    }

    const data = await res.json()
    return (data?.result ?? data) as SongDto
}