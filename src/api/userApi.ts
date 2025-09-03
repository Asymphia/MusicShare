export interface UserDto {
    id: number
    name: string
    imageUrl?: string | null
}

const API_BASE = import.meta.env.VITE_API_BASE

export async function getCurrentUser(): Promise<UserDto> {
    const res = await fetch(`${API_BASE}/api/User`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })

    if(!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch current user: ${res.status} ${res.statusText} - ${text}`)
    }

    return res.json() as Promise<UserDto>
}