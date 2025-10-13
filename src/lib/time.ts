export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60).toFixed(0)
    const remainingSeconds = seconds % 60
    const formattedSeconds = remainingSeconds.toFixed(0).toString().padStart(2, "0")
    return `${minutes}:${formattedSeconds}`
}