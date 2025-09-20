import Overlay from "../ui/Overlay.tsx"
import Icon from "../ui/Icon.tsx"

interface SongListItemProps {
    image: string
    song: string
    artist: string
    album: string
    length: string
    added: string
}

const SongListItem = ({image, song, artist, album, length, added}: SongListItemProps) => {
    return (
        <div className="grid grid-cols-3 items-center gap-6">
            <div className="flex items-center gap-3">
                <div
                    className="w-16 h-16 aspect-square relative p-[1px] bg-[linear-gradient(127deg,rgba(255,255,255,0.5)_1.98%,rgba(255,255,255,0)_38%,rgba(112,121,151,0)_58%,rgba(112,121,151,0.5)_100%)] rounded-2xl">
                    <img src={image} alt={song} className="rounded-[9px] aspect-square w-full h-full object-cover"/>
                    <Overlay offset={1} radius={9}/>
                </div>

                <div className="w-full">
                    <p className="font-text text-xs font-medium text-primary truncate">
                        { song }
                    </p>

                    <p className="font-text text-xs text-primary-60 truncate">
                        { artist }  &#x2022; { album }
                    </p>
                </div>
            </div>


            <p className="font-text text-xs text-primary-60 justify-self-center">
                { added }
            </p>

            <div className="flex items-center space-x-6 justify-self-end">
                <p className="font-text text-xs text-primary-60">
                    { length }
                </p>

                <Icon size={ 16 } name="play" className="fill-primary-60 hover:fill-primary w-4 h-4"/>
                <Icon size={ 16 } name="threeDots" className="fill-primary-60 hover:fill-primary w-4 h-4"/>
            </div>
        </div>
    )
}

export default SongListItem