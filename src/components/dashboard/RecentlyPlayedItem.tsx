import Overlay from "../ui/Overlay.tsx"
import Icon from "../ui/Icon.tsx"
import { Link } from "react-router-dom"
import useWindowWidth from "../../hooks/useWindowWidth.ts"
import { useMemo, useRef, useState } from "react"
import SongFilePopup from "../ui/SongFilePopup"
import placeholder from "../../assets/placeholders/song-placeholder.png"
import { formatTime } from "../../lib/time"
import { type PopupHandle } from "../ui/Popup"
import { usePlayer } from "../../hooks/usePlayer"
import { type ListeningHistoryItemDto } from "../../api/listeningHistoryApi"

interface RecentlyPlayedProps {
    listeningItem: ListeningHistoryItemDto
}

const RecentlyPlayedItem = ({ listeningItem }: RecentlyPlayedProps) => {
    const width = useWindowWidth()
    const { playSong, currentSong, isPlaying, toggle } = usePlayer()

    const [openSongId, setOpenSongId] = useState<string | false>(false)
    const popupRef = useRef<PopupHandle | null>(null)

    const openPopup = (spotifyId: string) => setOpenSongId(spotifyId)
    const closePopup = () => setOpenSongId(false)

    const modalRoot = typeof document !== "undefined" ? document.getElementById("modal") : null

    const isCurrentSong = useMemo(() => {
        return currentSong?.songShort.spotifyId === listeningItem.songShort.spotifyId
    }, [currentSong, listeningItem.songShort.spotifyId])

    const handlePlay = () => {
        if(isPlaying && currentSong.songShort.spotifyId === listeningItem.songShort.spotifyId) {
            toggle()
        } else {
            playSong(listeningItem)
        }
    }

    return (
        <div className="p-[1px] md:h-[62px] h-[52px] relative rounded-2xl gradient-border">
            <img alt={listeningItem.songShort.title} src={listeningItem.songShort.coverImageUrl || placeholder} className="md:h-[60px] h-[50px] w-[80px] absolute top-[1px] left-[1px] object-cover cover-mask-gradient rounded-[9px] z-20" />
            <Overlay offset={1} radius={9} isTransparent={false} className="!bg-[linear-gradient(127deg,#242424_0%,#353535_60%)]" />
            <Overlay offset={1} radius={9} isTransparent={true} className="md:!h-[60px] !h-[50px] !w-[80px] !bg-[linear-gradient(110deg,#ffffff_0%,#ffffff00_60%)]" />

            <div className="relative z-30 ml-[90px] mr-6 h-full flex justify-between items-center">
                <div className="w-fit space-y-1">
                    <p className="text-primary font-text font-medium xl:text-xs md:text-2xs text-3xs">
                        { listeningItem.songShort.title }
                    </p>
                    <p className="text-primary-60 font-text xl:text-xs md:text-2xs text-3xs">
                        {
                            listeningItem.playlistShort?.id ?
                                <Link className="transition hover:text-primary-80 active:text-primary" to={`/playlists/${listeningItem.playlistShort.id}`}>{ listeningItem.playlistShort.name }</Link>
                                : ( <> { listeningItem.playlistShort?.name || "Unknown" } </> )
                        }
                        &nbsp;&#x2022; { listeningItem.genreShortModelDTO.length > 0 ? listeningItem.genreShortModelDTO[0].name : "Unknown" }
                    </p>
                </div>

                <div className="w-fit flex items-center md:space-x-6 xpace-x-3">
                    <p className="text-primary-60 font-text text-xs" >
                        { formatTime(listeningItem.songShort.songLengthInSeconds || 0) }
                    </p>

                    <button type="button" className="cursor-pointer" onClick={handlePlay}>
                        <Icon size={ width >= 768 ? 16 : 12 } name={isCurrentSong && isPlaying ? "pause" : "play"} className="fill-primary-60 hover:fill-primary-80 active:fill-primary md:w-4 md:h-4 w-3 h-3" />
                    </button>

                    <button type="button" className="cursor-pointer" onClick={() => openPopup(listeningItem.songShort.spotifyId)}>
                        <Icon size={ width >= 768 ? 16 : 12 } name="threeDots" className="fill-primary-60 hover:fill-primary-80 active:fill-primary md:w-4 md:h-4 w-3 h-3" />
                    </button>
                </div>
            </div>

            { currentSong && <SongFilePopup ref={popupRef} isOpen={!!openSongId} close={closePopup} songId={String(openSongId || "")} portalContainer={modalRoot} songName={currentSong.songShort.title} hasFile={!!currentSong.songShort.spotifyId} /> }
        </div>
    )
}

export default RecentlyPlayedItem