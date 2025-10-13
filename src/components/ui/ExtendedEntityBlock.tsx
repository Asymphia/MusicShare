import Overlay from "./Overlay.tsx"
import Icon from "./Icon.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"
import MorphIcon from "./MorphIcon.tsx"
import { Link } from "react-router-dom"

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
    id?: number | string
    onClickPlus?: () => void
    isChecked?: boolean
    disableLink?: boolean
}


const ExtendedEntityBlock = ({isTop, image, type, song, album, artist, playlist, songAmount, duration, creator, id, onClickPlus, isChecked = false, disableLink = false}: ExtendedEntityBlockProps) => {
    const displayName = type === "song" ? song : type === "album" ? album : playlist
    const width = useWindowWidth()

    const isLink = (type === "playlist" || type === "album") && !disableLink
    const Container: any = isLink ? Link : "div"
    const containerProps = isLink ? { to: type === "playlist" ? `/playlists/${id}` : `/albums/${id}` } : {}

    return (
        <Container {...containerProps}  className={`flex flex-nowrap md:space-x-4 space-x-2 items-center p-2 rounded-2xl ${ Container === Link && "transition bg-bg-secondary hover:bg-bg-primary-50 active:bg-bg-primary" }`}>
            <div className="flex-shrink-0 md:w-20 md:h-20 w-16 h-16 aspect-square relative p-[1px] bg-[linear-gradient(127deg,rgba(255,255,255,0.5)_1.98%,rgba(255,255,255,0)_38%,rgba(112,121,151,0)_58%,rgba(112,121,151,0.5)_100%)] rounded-2xl">
                <img src={ image } alt={ displayName } className="rounded-[9px] aspect-square w-full h-full object-cover" loading="lazy" />
                <Overlay offset={1} radius={9} />
            </div>

            <div className="min-w-0 overflow-hidden">
                <p className="font-text xl:text-xs text-2xs text-primary md:mb-2 mb-1 min-w-0 overflow-hidden flex items-center">
                    {
                        isTop && <Icon size={width >= 1280 ? 19 : width >= 768 ? 14 : 12} name="throne"
                                    className="stroke-primary fill-none xl:w-[19px] xl:h-[19px] md:w-[14px] md:h-[14px] w-[12px] h-[12px] inline-block md:mr-2 mr-1 flex-shrink-0"/>
                    }
                    <span className="truncate min-w-0">{displayName}</span>
                    {
                        song && (
                            <button type="button" onClick={onClickPlus}
                                    className="cursor-pointer flex-shrink-0 inline-block md:ml-2 ml-1">
                                <MorphIcon isChecked={isChecked} size={width >= 1280 ? 16 : width >= 768 ? 14 : 12}
                                           className="fill-primary-60 hover:fill-primary-80 active:fill-primary"/>
                            </button>
                        )
                    }
                </p>

                <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 md:mb-1 mb-0 truncate">
                    by {type === "playlist" ? creator : artist}
                </p>

                <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 flex flex-nowrap items-center gap-3 min-w-0 overflow-hidden">
                    {type === "song" ? <span className="truncate min-w-0"> from {album} </span> :
                        <>
                            <span className="flex flex-nowrap items-center gap-2 flex-shrink-0">
                                <Icon size={12} name="musicNote" className="fill-primary-60 w-[12px] h-[12px]"/>
                                {songAmount} songs
                            </span>

                            <span className="flex-shrink-0">&#x2022;</span>

                            <span className="flex flex-nowrap items-center gap-2 flex-shrink-0">
                                <Icon size={width > 1280 ? 17 : 12} name="clock"
                                      className="fill-none stroke-primary-60 stroke-[1.5px] xl:w-[17px] xl:h-[17px] w-[12px] h-[12px]"/>
                                {
                                    duration && duration > 60
                                        ? `${Number.isInteger(duration / 60) ? (duration / 60) : (duration / 60).toFixed(1)} h`
                                        : `${duration} mins`
                                }
                            </span>
                        </>
                    }

                </p>
            </div>
        </Container>
    )
}

export default ExtendedEntityBlock