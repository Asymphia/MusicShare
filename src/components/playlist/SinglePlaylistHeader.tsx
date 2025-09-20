import Overlay from "../ui/Overlay.tsx"
import SectionHeader from "../ui/SectionHeader.tsx"
import Icon from "../ui/Icon.tsx"

interface SinglePlaylistHeaderProps {
    image: string
    title: string
    description: string
    author: string
    songAmount: number
    duration: number
}

const SinglePlaylistHeader = ({ image, title, description, author, songAmount, duration }: SinglePlaylistHeaderProps) => {
    return (
        <div className="sticky top-0">
            <div
                className="w-full aspect-square relative p-[3px] bg-[linear-gradient(127deg,rgba(255,255,255,0.5)_1.98%,rgba(255,255,255,0)_38%,rgba(112,121,151,0)_58%,rgba(112,121,151,0.5)_100%)] rounded-4xl">
                <img src={ image } alt={ title }
                     className="rounded-[37px] aspect-square w-full h-full object-cover"/>
                <Overlay offset={3} radius={37}/>
            </div>

            <SectionHeader title={ title } as="h1" className="mt-4"/>

            <p className="font-text text-xs text-primary truncate">
                { description !== "" ? description : "No description yet" }
            </p>

            <p className="font-text text-xs text-primary-60 mt-4">
                by { author }
            </p>

            <p className="font-text text-xs text-primary-60 flex items-center gap-3 mt-2">
                    <span className="flex flex-nowrap items-center gap-2">
                        <Icon size={ 12 } name="musicNote" className="fill-primary-60 w-[12px] h-[12px]"/>
                        { songAmount } songs
                    </span>

                &#x2022;

                <span className="flex flex-nowrap items-center gap-2">
                        <Icon name="clock" size={ 17 } className="fill-none stroke-primary-60 stroke-[1.5px] w-[17px] h-[17px]"/>
                    {
                        duration && duration > 60
                            ? `${Number.isInteger(duration / 60) ? (duration / 60) : (duration / 60).toFixed(1)} h`
                            : `${duration} mins`
                    }
                    </span>
            </p>

            <div className="flex gap-3 mt-4">
                <Icon name="share" size={ 19 }
                      className="w-[19px] h-[19px] fill-primary-60 hover:fill-primary-80 active:fill-primary"/>
                <Icon name="download" size={ 19 }
                      className="w-[19px] h-[19px] fill-primary-60 hover:fill-primary-80 active:fill-primary"/>
            </div>

        </div>
    )
}

export default SinglePlaylistHeader