import Overlay from "./Overlay.tsx";
import Icon from "./Icon.tsx";
import {Link} from "react-router-dom";

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

    return (
        <Link to={type === "playlist" ? `/playlists/${id}` : "/"} className="flex flex-nowrap space-x-4 items-center">
            <div className="w-20 h-20 aspect-square relative p-[1px] bg-[linear-gradient(127deg,rgba(255,255,255,0.5)_1.98%,rgba(255,255,255,0)_38%,rgba(112,121,151,0)_58%,rgba(112,121,151,0.5)_100%)] rounded-2xl">
                <img src={ image } alt={ displayName } className="rounded-[9px] aspect-square w-full h-full object-cover"/>
                <Overlay offset={1} radius={9} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="font-text text-xs text-primary mb-2 truncate">
                    { isTop && <Icon name="throne" className="stroke-primary fill-none w-[19px] h-[19px] inline-block mr-2" /> }
                    { displayName }
                    { song && <Icon name="plus" className="fill-primary-60 w-[19px] h-[19px] inline-block ml-2 hover:fill-primary-80 active:fill-primary cursor-pointer" /> }
                </p>

                <p className="font-text text-xs text-primary-60 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    by { type === "playlist" ? creator : artist }
                </p>

                <p className="font-text text-xs text-primary-60 whitespace-nowrap overflow-hidden text-ellipsis flex flex-nowrap gap-3">
                    { type === "song" ? <span> from {album} </span> :
                        <>
                            <span className="flex flex-nowrap items-center gap-2">
                                <Icon name="musicNote" className="fill-primary-60 w-[12px] h-[12px]"/>
                                { songAmount } songs
                            </span>

                            &#x2022;

                            <span className="flex flex-nowrap items-center gap-2">
                                <Icon name="clock" className="fill-none stroke-primary-60 stroke-[1.5px] w-[17px] h-[17px]"/>
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