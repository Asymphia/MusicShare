export interface artistsDto {
    spotifyId: string
    name: string
    imageUrl?: string
}

const API_BASE = import.meta.env.VITE_API_BASE

export async function getTopArtists(take: number): Promise<artistsDto[]> {
    const res = await fetch(`${API_BASE}/api/ListeningHistory/top-artists?top=${take}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch top artists: ${res.status} ${text}`)
    }

    return await res.json() as Promise<artistsDto[]>
}

export async function getRecommendedArtists(): Promise<artistsDto[]> {
    const res = await fetch(`${API_BASE}/api/Recommendation/artists`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch recommended artists: ${res.status} ${text}`)
    }

    return await res.json() as Promise<artistsDto[]>
}