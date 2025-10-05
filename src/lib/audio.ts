export function getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            const url = URL.createObjectURL(file)
            const audio = new Audio()
            audio.preload = "metadata"
            audio.src = url

            const clean = () => {
                try {
                    URL.revokeObjectURL(url)
                } catch {}
            }

            const onLoaded = () => {
                const duration = Number.isFinite(audio.duration) ? audio.duration : 0
                clean()
                resolve(duration)
            }

            const onError = () => {
                clean()
                reject(new Error("Failed to load audio metadata"))
            }

            audio.addEventListener("loadedmetadata", onLoaded, { once: true })
            audio.addEventListener("error", onError, { once: true })
        } catch (err) {
            reject(err)
        }
    })
}