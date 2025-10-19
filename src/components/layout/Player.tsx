import AsideButtons from "./AsideButtons.tsx"
import CurrentlyPlayingSong from "./CurrentlyPlayingSong.tsx"
import Icon from "../ui/Icon.tsx"
import noise from "../../assets/icons/noise.svg"
import useWindowWidth from "../../hooks/useWindowWidth.ts"
import { formatTime } from "../../lib/time"
import { usePlayer } from "../../hooks/usePlayer"
import { useMemo, type MouseEvent } from "react"

const Player = () => {
    const width = useWindowWidth()
    const { currentSong, isPlaying, currentTime, duration, toggle, next, previous, seek } = usePlayer()

    const progress = useMemo(() => {
        return duration > 0 ? (currentTime / duration) * 100 : 0
    }, [currentTime, duration])

    const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = x / rect.width
        const newTime = percentage * duration
        seek(newTime)
    }

    return (
        <div className="xl:px-4 md:px-8 px-4">
            <div className="w-full py-2 xl:flex xl:flex-nowrap xl:justify-between items-center grid sm:grid-cols-3 grid-cols-2">
                <CurrentlyPlayingSong />

                <div className="flex flex-col items-center space-y-1 justify-self-center">
                    <div className="flex flex-nowrap xl:space-x-10 space-x-6 items-center">
                        <button onClick={previous} disabled={!currentSong}>
                            <Icon size={ width >= 1280 ? 20 : width >= 768 ? 16 : 12 } name="previous" className="xl:h-5 xl:w-5 md:w-4 md:h-4 w-3 h-3 fill-primary-60 hover:fill-primary-80 active:fill-primary cursor-pointer"/>
                        </button>

                        <button onClick={toggle} disabled={!currentSong} className="relative xl:w-10 xl:h-10 md:w-8 md:h-8 w-6 h-6 flex items-center justify-center group cursor-pointer">
                            <img src={ noise } alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 pointer-events-none"/>
                            <Icon size={ width >= 1280 ? 20 : width >= 768 ? 16 : 12 } name={isPlaying ? "pause" : "play"} className="xl:h-5 xl:w-5 md:h-4 md:w-4 h-3 w-3 fill-primary-60 group-hover:fill-primary-80 group-active:fill-primary"/>
                        </button>

                        <button onClick={next} disabled={!currentSong}>
                            <Icon size={ width >= 1280 ? 20 : width >= 768 ? 16 : 12 } name="next" className="xl:h-5 xl:w-5 md:w-4 md:h-4 w-3 h-3 fill-primary-60 hover:fill-primary-80 active:fill-primary cursor-pointer"/>
                        </button>
                    </div>

                    <div className="font-text text-primary-60 text-xs items-center space-x-3 xl:flex hidden">
                        <p> { formatTime(currentTime) } </p>

                        <div onClick={handleSeek} className="border-0 h-1 transition bg-primary-60 hover:bg-primary-80 active:bg-primary rounded-full w-[700px] relative cursor-pointer group">
                            <div className="border-0 h-1 bg-accent rounded-full absolute inset-0" style={{ width: `${progress}%` }} />
                            <div className="w-3 h-3 rounded-full transition opacity-0 group-hover:opacity-100 bg-accent absolute top-1/2 -translate-y-1/2" style={{ left: `calc(${progress}% - 6px)` }} />
                        </div>

                        <p> { formatTime(duration) } </p>
                    </div>
                </div>

                <AsideButtons/>
            </div>

            <hr className="border-0 h-1 bg-primary-60 rounded-full w-full xl:hidden block"/>
        </div>
)
}

export default Player