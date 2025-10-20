import Icon from "../ui/Icon.tsx"
import TextWithIcon from "../ui/TextWithIcon.tsx"
import FeaturedButton from "../ui/FeaturedButton.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"
import { formatTime } from "../../lib/time"
import { formatDate } from "../../lib/date"
import {useRef, useState} from "react";
import type { PopupHandle } from "../ui/Popup"
import AddToPlaylistPopup from "../ui/AddToPlaylistPopup"

interface FeaturedProps {
    imageUrl: string
    song: string
    artist: string
    album: string
    songLengthInSeconds?: number | null
    releaseDate?: string | null
    songId: string
}

const Featured = ({ imageUrl, song, artist, album, songLengthInSeconds = null, releaseDate = null, songId }: FeaturedProps) => {
    const width = useWindowWidth()

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const popupRef = useRef<PopupHandle | null>(null)

    const openPopup = () => setIsOpen(true)
    const closePopup = () => setIsOpen(false)

    const modalRoot = typeof document !== "undefined" ? document.getElementById("modal-playlist") : null

    return (
        <div className="relative xl:h-[429px] md:h-[360px] sm:h-[300px] h-[240px] xl:p-[3px] p-[2px] bg-[linear-gradient(127deg,rgba(255,255,255,0.5)_1.98%,rgba(255,255,255,0)_38%,rgba(112,121,151,0)_58%,rgba(112,121,151,0.5)_100%)] md:rounded-4xl rounded-3xl">
            <img src={ imageUrl } alt={`Featured song: "${ song }" cover by ${ artist }`} className="xl:h-[423px] xl:w-[423px] md:h-[360px] md:w-[360px] sm:h-[300px] sm:w-[300px] h-[240px] w-[240px] absolute xl:top-[3px] xl:right-[3px] top-[2xp] right-[2px] object-cover mask-gradient md:rounded-[37px] rounded-[18px]"/>

            <div className="h-full md:rounded-[37px] rounded-[18px] bg-[linear-gradient(127deg,#545454_0%,#313131_60%)] xl:py-12 xl:px-10 lg:py-7 lg:px-9 md:py-6 md:px-8 sm:py-5 sm:px-7 py-4 px-6 flex flex-col justify-between items-start">
                <p className="font-text xl:text-l md:text-s sm:text-xs text-2xs text-primary-60 flex flex-nowrap items-center gap-3">
                    Selected especially for you
                    <Icon size={ width >= 1280 ? 20 : width >= 768 ? 16 : 12 } name="star" className="xl:w-5 xl:h-5 md:w-4 md:h-4 w-3 h-3 fill-primary-60 inline-block" />
                </p>

                <div className="max-w-full">
                    <div className="sm:mb-8 mb-4 space-y-1">
                        <h2 className="font-semibold sm:mb-7 mb-4 truncate">
                            { song }
                        </h2>
                        <p className="font-header text-primary xl:text-l md:text-s sm:text-xs text-2xs truncate">
                            by { artist }
                        </p>
                        <p className="font-header text-primary xl:text-l md:text-s sm:text-xs text-2xs truncate">
                            from { album }
                        </p>
                    </div>

                    <div className="flex flex-nowrap items-center md:gap-6 sm:gap-4 gap-2">
                        <TextWithIcon text={ songLengthInSeconds ? formatTime(songLengthInSeconds) : "unknown" } icon="clock" iconClassName="stroke-primary-60 fill-none w-5 h-5" />

                        <span className="font-text text-primary-60 text-xs">
                            &#x2022;
                        </span>

                        <TextWithIcon text={ releaseDate ? formatDate(releaseDate) : "unknown" } icon="calendar" iconClassName="stroke-primary-60 fill-none w-5 h-5" />
                    </div>
                </div>

                <FeaturedButton text="Add to playlist" icon="plus" onClick={openPopup} />
            </div>

            <AddToPlaylistPopup ref={popupRef} isOpen={isOpen} close={closePopup} songId={String(songId || "")} portalContainer={modalRoot} />
        </div>
    )
}

export default Featured
