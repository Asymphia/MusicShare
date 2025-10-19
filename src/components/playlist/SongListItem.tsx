import Overlay from "../ui/Overlay.tsx"
import Icon from "../ui/Icon.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"
import { usePlayer } from "../../hooks/usePlayer"
import { useMemo } from "react";
import { type SongDto } from "../../api/songsApi"
import placeholder from "../../assets/placeholders/song-placeholder.png"
import { formatTime } from "../../lib/time.ts"
import { formatDate } from "../../lib/date.ts"
import { type PlaylistDto } from "../../api/playlistApi"
import { type PlaylistShortDto } from "../../api/listeningHistoryApi"

interface SongListItemProps {
    onClick: () => void
    songItem: SongDto
    isAlbum: boolean
    album?: string
    length?: number
    playlist?: PlaylistDto
}

const SongListItem = ({ onClick, songItem, isAlbum, album, length, playlist }: SongListItemProps) => {
    const width = useWindowWidth()

    const { playSong, currentSong, isPlaying, toggle, convertSongToHistoryItem } = usePlayer()

    const isCurrentSong = useMemo(() => {
        return currentSong?.songShort.spotifyId === songItem.spotifyId
    }, [currentSong, songItem.spotifyId])

    const handlePlay = () => {
        if(isPlaying && currentSong.songShort.spotifyId === songItem.spotifyId) {
            toggle()
        } else {
            playSong(convertSongToHistoryItem(songItem, playlist && {
                id: playlist.id,
                spotifyId: playlist.spotifyId,
                name: playlist.name,
                coverImageUrl: playlist.coverImageUrl
            } as PlaylistShortDto))
        }
    }

    return (
        <div className="grid lg:grid-cols-3 grid-cols-2 items-center gap-6 rounded-2xl pr-4 pl-1 py-1 bg-bg-secondary transition hover:bg-bg-primary-50 active:bg-bg-primary">
            <div className="flex items-center gap-3">
                <div
                    className="xl:w-16 xl:h-16 md:w-14 md:h-14 w-12 h-12 aspect-square relative p-[1px] bg-[linear-gradient(127deg,rgba(255,255,255,0.5)_1.98%,rgba(255,255,255,0)_38%,rgba(112,121,151,0)_58%,rgba(112,121,151,0.5)_100%)] rounded-2xl">
                    <img src={songItem.coverImageUrl || placeholder} alt={songItem.title} className="rounded-[9px] aspect-square w-full h-full object-cover"/>
                    <Overlay offset={1} radius={9}/>
                </div>

                <div className="w-full space-y-1">
                    <p className="font-text xl:text-xs md:text-2xs text-3xs font-medium text-primary truncate">
                        { songItem.title }
                    </p>

                    <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 truncate">
                        { songItem.artist }  &#x2022; { album || "Unknown" }
                    </p>
                </div>
            </div>


            <p className="font-text lg:block hidden text-primary-60 justify-self-center xl:text-xs md:text-2xs">
                { songItem.releaseDate !== undefined && formatDate(songItem.releaseDate) }
            </p>

            <div className="flex items-center xl:space-x-6 md:space-x-4 space-x-2 justify-self-end">
                <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60">
                    { songItem.songLengthInSeconds ? formatTime(length || 0) : "" }
                </p>

                {
                    !isAlbum && songItem.songLengthInSeconds && (
                        <button type="button" className="cursor-pointer" onClick={handlePlay}>
                            <Icon size={ width >= 1280 ? 16 : width >= 768 ? 12 : 8 } name={isCurrentSong && isPlaying ? "pause" : "play"} className="fill-primary-60 hover:fill-primary-80 active:fill-primary xl:w-4 xl:h-4 md:w-3 md:h-3 w-2 h-2"/>
                        </button>
                    )
                }

                <button type="button" className="cursor-pointer" onClick={onClick}>
                    <Icon size={ width >= 1280 ? 16 : width >= 768 ? 12 : 8 } name="threeDots" className="fill-primary-60 hover:fill-primary-80 active:fill-primary xl:w-4 xl:h-4 md:w-3 md:h-3 w-2 h-2"/>
                </button>
            </div>
        </div>
    )
}

export default SongListItem