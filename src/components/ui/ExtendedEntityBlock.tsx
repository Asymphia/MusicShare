import Overlay from "./Overlay.tsx";
import Icon from "./Icon.tsx";
import {Link} from "react-router-dom";
import useWindowWidth from "../../hooks/useWindowWidth.ts";

interface ExtendedEntityBlockProps {
    isTop: boolean
    image: string
    type: "album" | "song" | "playlist"
    song?: string
    album?: string
    artist?: string
    playlist?: string
    songAmount?: number
    duration?: number
    creator?: string
    id?: number
}


const ExtendedEntityBlock = ({isTop, image, type, song, album, artist, playlist, songAmount, duration, creator, id}: ExtendedEntityBlockProps) => {

    const displayName = type === "song" ? song : type === "album" ? album : playlist
    const width = useWindowWidth()

    return (
        <Link to={type === "playlist" ? `/playlists/${id}` : "/"} className="flex flex-nowrap md:space-x-4 space-x-2 items-center">
            <div className="md:w-20 md:h-20 w-16 h-16 aspect-square relative p-[1px] bg-[linear-gradient(127deg,rgba(255,255,255,0.5)_1.98%,rgba(255,255,255,0)_38%,rgba(112,121,151,0)_58%,rgba(112,121,151,0.5)_100%)] rounded-2xl">
                <img src={ image } alt={ displayName } className="rounded-[9px] aspect-square w-full h-full object-cover"/>
                <Overlay offset={1} radius={9} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="font-text xl:text-xs text-2xs text-primary md:mb-2 mb-1 truncate">
                    { isTop && <Icon size={ width >= 1280 ? 19 : width >= 768 ? 14 : 12 } name="throne" className="stroke-primary fill-none xl:w-[19px] xl:h-[19px] md:w-[14px] md:h-[14px] w-[12px] h-[12px] inline-block md:mr-2 mr-1" /> }
                    { displayName }
                    { song && <Icon size={ width >= 1280 ? 19 : width >= 768 ? 14 : 12 } name="plus" className="fill-primary-60 xl:w-[19px] xl:h-[19px] md:w-[14px] md:h-[14px] w-[12px] h-[12px] inline-block md:ml-2 ml-1 hover:fill-primary-80 active:fill-primary cursor-pointer" /> }
                </p>

                <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 md:mb-1 mb-0 whitespace-nowrap overflow-hidden text-ellipsis">
                    by { type === "playlist" ? creator : artist }
                </p>

                <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 whitespace-nowrap overflow-hidden text-ellipsis flex flex-nowrap gap-3">
                    { type === "song" ? <span> from {album} </span> :
                        <>
                            <span className="flex flex-nowrap items-center gap-2">
                                <Icon size={ 12 } name="musicNote" className="fill-primary-60 w-[12px] h-[12px]"/>
                                { songAmount } songs
                            </span>

                            &#x2022;

                            <span className="flex flex-nowrap items-center gap-2">
                                <Icon size={ width > 1280 ? 17 : 12 } name="clock" className="fill-none stroke-primary-60 stroke-[1.5px] xl:w-[17px] xl:h-[17px] w-[12px] h-[12px]"/>
                                { duration && duration > 60
                                    ? `${Number.isInteger(duration / 60) ? (duration / 60) : (duration / 60).toFixed(1)} h`
                                    : `${duration} mins` }
                            </span>
                        </>
                    }

                </p>
            </div>
        </Link>
    )
}

export default ExtendedEntityBlock