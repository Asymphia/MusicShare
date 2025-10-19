import placeholder from "../../assets/placeholders/song-placeholder.png"
import { usePlayer } from "../../hooks/usePlayer"

const CurrentlyPlayingSong = () => {
    const { currentSong } = usePlayer()

    if (!currentSong) {
        return (
            <div className="flex flex-nowrap xl:space-x-6 space-x-2">
                <img
                    src={placeholder}
                    alt="No song playing"
                    className="rounded-2xl xl:w-17 xl:h-17 md:h-15 md:w-15 w-13 h-13 opacity-40"
                />
                <div className="font-text space-y-1">
                    <p className="xl:text-s md:text-xs text-2xs text-primary-40 font-medium">
                        No song playing
                    </p>
                    <p className="xl:text-xs md:text-2xs text-3xs text-primary-40">
                        Select a song to play
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-nowrap xl:space-x-6 space-x-2">
            <img src={ currentSong.songShort?.coverImageUrl || placeholder } alt={ currentSong.songShort?.title || "Placeholder song cover" } className="rounded-2xl xl:w-17 xl:h-17 md:h-15 md:w-15 w-13 h-13"/>
            <div className="font-text space-y-1 min-w-0">
                <p className="xl:text-s md:text-xs text-2xs text-primary font-medium min-w-0 truncate">
                    { currentSong.songShort?.title || "No song currently playing" }
                </p>
                <p className="xl:text-xs md:text-2xs text-3xs text-primary-60 min-w-0 truncate">
                    { currentSong.playlistShort?.name || "Unknown" } <br/>
                    { currentSong.genreShortModelDTO.length > 0 ? currentSong.genreShortModelDTO[0].name : "Unknown" }
                </p>
            </div>
        </div>
    )
}

export default CurrentlyPlayingSong