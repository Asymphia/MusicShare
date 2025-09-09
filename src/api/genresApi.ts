export interface topGenresDto {
    id: number
    name: string
}

const API_BASE = import.meta.env.VITE_API_BASE

export async function getTopGenres(take: number): Promise<topGenresDto[]> {
    const res = await fetch(`${API_BASE}/api/ListeningHistory/top-genres?top=${take}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch top genres: ${res.status} ${text}`)
    }

    return await res.json() as Promise<topGenresDto[]>
}