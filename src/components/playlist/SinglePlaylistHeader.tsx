import Overlay from "../ui/Overlay.tsx"
import SectionHeader from "../ui/SectionHeader.tsx"
import Icon from "../ui/Icon.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"

interface SinglePlaylistHeaderProps {
    image: string
    title: string
    description?: string
    author: string
    songAmount: number
    duration: number
}

const SinglePlaylistHeader = ({ image, title, description = "", author, songAmount, duration }: SinglePlaylistHeaderProps) => {
    const width = useWindowWidth()

    return (
        <div className="sticky top-0">
            <div
                className="sm:w-full w-1/2 mx-auto aspect-square relative md:p-[3px] p-[2px] bg-[linear-gradient(127deg,rgba(255,255,255,0.5)_1.98%,rgba(255,255,255,0)_38%,rgba(112,121,151,0)_58%,rgba(112,121,151,0.5)_100%)] md:rounded-4xl rounded-3xl">
                <img src={ image } alt={ title }
                     className="md:rounded-[37px] rounded-[18px] aspect-square w-full h-full object-cover"/>
                <Overlay offset={ width >= 768 ? 3 : 2 } radius={ width >= 768 ? 37 : 18 }/>
            </div>

            <SectionHeader title={ title } as="h1" className="mt-4"/>

            {
                description && (
                    <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary truncate">
                        { description }
                    </p>
                )
            }

            <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 mt-4">
                by { author }
            </p>

            <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 flex items-center gap-3 mt-2">
                    <span className="flex flex-nowrap items-center gap-2">
                        <Icon size={ width >= 1280 ? 12 : width >= 768 ? 11 : 10 } name="musicNote" className="fill-primary-60 xl:w-[12px] xl:h-[12px] md:w-[11px] md:h-[11px] w-[10px] h-[10px]"/>
                        { songAmount } songs
                    </span>

                &#x2022;

                <span className="flex flex-nowrap items-center gap-2">
                        <Icon name="clock" size={ width >= 1280 ? 17 : width >= 768 ? 15 : 13 } className="fill-none stroke-primary-60 stroke-[1.5px] xl:w-[17px] xl:h-[17px] md:w-[15px] md:h-[15px] w-[13px] h-[13px]"/>
                    {
                        duration && duration > 60
                            ? `${Number.isInteger(duration / 60) ? (duration / 60) : (duration / 60).toFixed(1)} h`
                            : `${duration} mins`
                    }
                    </span>
            </p>

            <div className="flex gap-3 mt-4">
                <Icon name="share" size={ width >= 1280 ? 19 : width >= 768 ? 17 : 15 }
                      className="xl:w-[19px] xl:h-[19px] md:w-[17px] md:h-[17px] w-[15px] h-[15px] fill-primary-60 hover:fill-primary-80 active:fill-primary"/>
                <Icon name="download" size={ width >= 1280 ? 19 : width >= 768 ? 17 : 15 }
                      className="xl:w-[19px] xl:h-[19px] md:w-[17px] md:h-[17px] w-[15px] h-[15px] fill-primary-60 hover:fill-primary-80 active:fill-primary"/>
            </div>

        </div>
    )
}

export default SinglePlaylistHeader