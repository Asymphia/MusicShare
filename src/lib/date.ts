export const formatDate = (iso?: string | null) => {
    if (!iso) return ""
    try {
        const d = new Date(iso)
        return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    } catch {
        return iso
    }
}