import Overlay from "../ui/Overlay.tsx";
import Icon from "../ui/Icon.tsx";

interface RecentlyPlayedProps {
    title: string
    artist: string
    album: string
    cover: string
    length: string
}

const RecentlyPlayed = ({title, artist, album, cover, length}: RecentlyPlayedProps) => {
    return (
        <div className="p-[1px] h-[62px] relative rounded-2xl gradient-border">
            <img src={cover} className="h-[60px] w-[80px] absolute top-[1px] left-[1px] object-cover cover-mask-gradient rounded-[9px] z-20" />
            <Overlay offset={1} radius={9} isTransparent={false} />

            <div className="relative z-30 ml-[90px] mr-6 h-full flex justify-between items-center">
                <div className="w-fit">
                    <p className="text-primary font-text font-medium text-xs">
                        { title }
                    </p>
                    <p className="text-primary-60 font-text text-xs">
                        { artist } &#x2022; { album }
                    </p>
                </div>

                <div className="w-fit flex items-center space-x-6">
                    <p className="text-primary-60 font-text text-xs" >
                        { length }
                    </p>
                    <Icon name="play" className="fill-primary-60 hover:fill-primary w-[11px] h-4" />
                    <Icon name="threeDots" className="fill-primary-60 hover:fill-primary w-[10px] h-4" />
                </div>
            </div>
        </div>
    )
}

export default RecentlyPlayed