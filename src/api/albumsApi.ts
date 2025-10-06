export interface aristShortDto {
    spotifyId: string
    name: string
    imageUrl?: string | null
}

export interface topAlbumsDto {
    spotifyId: string
    name: string
    coverImageUrl: string
    artist: aristShortDto
}

export interface SongDto {
    spotifyId: string
    title: string
    artist: string
    artistSpotifyId: string
    albumId: string
    isDraft: boolean
    coverImageUrl: string | null
    songLengthInSeconds: number | null
    localSongPath: string | null
    releaseDate: string | null
    createdAt: string | null
    updatedAt: string | null
    hasLocalFile: boolean
    isComplete: boolean
    displayArtist: string
    displayAlbum: string
}

export interface albumsDto {
    spotifyId: string
    name: string
    coverImageUrl?: string | null
    artist?: aristShortDto | null
    songs?: SongDto[]
}

const API_BASE = import.meta.env.VITE_API_BASE

export async function getTopAlbums(take: number): Promise<topAlbumsDto[]> {
    const res = await fetch(`${API_BASE}/api/ListeningHistory/top-albums?top=${take}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch top albums: ${res.status} ${text}`)
    }

    return await res.json() as Promise<topAlbumsDto[]>
}

export async function getAllAlbums():Promise<albumsDto[]> {
    const res = await fetch(`${API_BASE}/api/Album`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch all albums: ${res.status} ${text}`)
    }

    return await res.json() as albumsDto[]
}

export async function getAlbumById(albumId: string): Promise<albumsDto> {
    const res = await fetch(`${API_BASE}/api/Album/${albumId}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch all albums: ${res.status} ${text}`)
    }

    const data = await res.json()
    return data as albumsDto
}

export async function getFeaturedAlbums(number: number): Promise<albumsDto[]> {
    const res = await fetch(`${API_BASE}/api/Recommendation/getRandomAlbums?top=${number}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch featured albums: ${res.status} ${text}`)
    }

    const data = await res.json()
    return data as albumsDto[]
}