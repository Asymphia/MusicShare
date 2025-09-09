export interface SongShortDto {
    spotifyId: string
    title: string
    coverImageUrl?: string | null
    songLengthInSeconds?: number | null
    releaseDate?: string | null
}

export interface PlaylistShortDto {
    id: number
    spotifyId: string
    name: string
    coverImageUrl?: string | null
}

export interface GenreShortDto {
    id: string
    name: string
}

export interface ListeningHistoryItemDto {
    id: string
    dateTime: string
    songShort: SongShortDto
    playlistShort?: PlaylistShortDto | null
    genreShortModelDTO: GenreShortDto[]
}

const API_BASE = import.meta.env.VITE_API_BASE

export async function getListeningHistory(take: number): Promise<ListeningHistoryItemDto[]> {
    const res = await fetch(`${API_BASE}/api/ListeningHistory/history/${take}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch listening history: ${res.status} ${res.statusText} - ${text}`)
    }

    return await res.json() as Promise<ListeningHistoryItemDto[]>
}