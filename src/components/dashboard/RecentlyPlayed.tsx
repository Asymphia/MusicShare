import Overlay from "../ui/Overlay.tsx";
import Icon from "../ui/Icon.tsx";
import {Link} from "react-router-dom";

interface RecentlyPlayedProps {
    title: string
    playlist: string
    genre: string
    cover: string
    length: string
    playlistId: number | null
}

const RecentlyPlayed = ({title, playlist, genre, cover, length, playlistId}: RecentlyPlayedProps) => {
    return (
        <div className="p-[1px] h-[62px] relative rounded-2xl gradient-border">
            <img src={cover} className="h-[60px] w-[80px] absolute top-[1px] left-[1px] object-cover cover-mask-gradient rounded-[9px] z-20" />
            <Overlay offset={1} radius={9} isTransparent={false} className="!bg-[linear-gradient(127deg,#242424_0%,#353535_60%)]" />
            <Overlay offset={1} radius={9} isTransparent={true} className="!h-[60px] !w-[80px] !bg-[linear-gradient(110deg,#ffffff_0%,#ffffff00_60%)]" />

            <div className="relative z-30 ml-[90px] mr-6 h-full flex justify-between items-center">
                <div className="w-fit">
                    <p className="text-primary font-text font-medium text-xs">
                        { title }
                    </p>
                    <p className="text-primary-60 font-text text-xs">
                        {
                            playlistId ?
                                <Link className="transition hover:text-primary-80 active:text-primary" to={`/playlists/${playlistId}`}>{ playlist }</Link>
                                : ( <> { playlist } </> )
                        }
                        &nbsp;&#x2022; { genre }
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