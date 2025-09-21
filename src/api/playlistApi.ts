export interface SongDto {
    spotifyId: string
    title: string
    artist: string
    artistSpotifyId?: string
    album?: string
    isDraft?: boolean
    coverImageUrl?: string | null
    songLengthInSeconds?: number
    localSongPath?: string | null
    releaseDate?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    hasLocalFile?: boolean
    isComplete?: boolean
    displayArtist?: string
    displayAlbum?: string
}

export interface PlaylistDto {
    id: number
    spotifyId: string
    name: string
    coverImageUrl?: string | null
    ownerName?: string | null
    description?: string | null
    songs?: SongDto[]
}

const API_BASE = import.meta.env.VITE_API_BASE

export async function getAllPlaylists(): Promise<PlaylistDto[]> {
    const res = await fetch(`${API_BASE}/api/Spotify/playlist/getAll`, {
        method: "POST",
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

export async function triggerFetchSongsForSpotifyPlaylist(spotifyId: string): Promise<PlaylistDto> {
    const url = `${API_BASE}/api/Spotify/playlist/${encodeURIComponent(spotifyId)}/songs/getAll`
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json"
        },
        body: ""
    })

    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to trigger spotify songs fetch for ${spotifyId}: ${res.status} ${text}`)
    }

    const data = await res.json()
    return data as PlaylistDto
}

export async function getPlaylistById(id: number): Promise<PlaylistDto> {
    const res = await fetch(`${API_BASE}/api/Playlist/${id}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch playlist ${id}: ${res.status} ${text}`)
    }

    const data = await res.json()
    return data as PlaylistDto
}