export interface topAlbumsDto {
    spotifyId: string
    name: string
    coverImageUrl: string
}

export interface aristShortDto {
    spotifyId: string
    name: string
    imageUrl?: string | null
}

export interface albumsDto {
    spotifyId: string
    name: string
    coverImageUrl?: string | null
    artist?: aristShortDto | null
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