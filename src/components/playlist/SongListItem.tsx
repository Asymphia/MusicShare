import Overlay from "../ui/Overlay.tsx"
import Icon from "../ui/Icon.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"

interface SongListItemProps {
    image: string
    song: string
    artist: string
    album: string
    length: string
    added: string
}

const SongListItem = ({image, song, artist, album, length, added}: SongListItemProps) => {
    const width = useWindowWidth()

    return (
        <div className="grid lg:grid-cols-3 grid-cols-2 items-center gap-6">
            <div className="flex items-center gap-3">
                <div
                    className="xl:w-16 xl:h-16 md:w-14 md:h-14 w-12 h-12 aspect-square relative p-[1px] bg-[linear-gradient(127deg,rgba(255,255,255,0.5)_1.98%,rgba(255,255,255,0)_38%,rgba(112,121,151,0)_58%,rgba(112,121,151,0.5)_100%)] rounded-2xl">
                    <img src={image} alt={song} className="rounded-[9px] aspect-square w-full h-full object-cover"/>
                    <Overlay offset={1} radius={9}/>
                </div>

                <div className="w-full">
                    <p className="font-text xl:text-xs md:text-2xs text-3xs font-medium text-primary truncate">
                        { song }
                    </p>

                    <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 truncate">
                        { artist }  &#x2022; { album }
                    </p>
                </div>
            </div>


            <p className="font-text lg:block hidden text-primary-60 justify-self-center xl:text-xs md:text-2xs">
                { added }
            </p>

            <div className="flex items-center xl:space-x-6 md:space-x-4 space-x-2 justify-self-end">
                <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60">
                    { length }
                </p>

                <Icon size={ width >= 1280 ? 16 : width >= 768 ? 12 : 8 } name="play" className="fill-primary-60 hover:fill-primary xl:w-4 xl:h-4 md:w-3 md:h-3 w-2 h-2"/>
                <Icon size={ width >= 1280 ? 16 : width >= 768 ? 12 : 8 } name="threeDots" className="fill-primary-60 hover:fill-primary xl:w-4 xl:h-4 md:w-3 md:h-3 w-2 h-2"/>
            </div>
        </div>
    )
}

export default SongListItem