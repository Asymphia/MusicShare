import Overlay from "./Overlay.tsx"
import {type JSX} from "react"
import useWindowWidth from "../../hooks/useWindowWidth.ts";
import {Link} from "react-router-dom";

interface EntityBlockProps {
    image: string
    type: "album" | "song" | "artist"
    song?: string
    album?: string
    artist?: string
    headerAs?: "h4" | "h5"
    link?: string
}

const EntityBlock = ({ image, type, album, artist, song, headerAs = "h4", link = "" }: EntityBlockProps) => {
    const width = useWindowWidth()

    const HeaderTag = headerAs as keyof JSX.IntrinsicElements
    const headerText = type === "album" ? album : type === "song" ? song : artist

    const Container: any = link ? Link : "div"
    const containerProps = link ? { to: link } : {}

    return (
        <Container { ...containerProps } className={`bg-bg-secondary p-2 rounded-3xl ${link && "transition hover:bg-bg-primary-50 active:bg-bg-primary"}`}>
            <div className={`aspect-square relative p-[2px] ${headerAs === "h4" ? "md:mb-3 mb-2" : "md:mb-2 mb-1"} ${ type === "artist" ? "rounded-full" : "md:rounded-3xl rounded-2xl" } gradient-border`}>
                <img src={image} alt={song ? song : album} className={`w-full aspect-square ${ type === "artist" ? "rounded-full" : "md:rounded-[18px] rounded-[8px]" }`} />

                <Overlay offset={2} radius={type === "artist" ? 1000 : width >= 768 ? 18 : 8} />
            </div>
            <HeaderTag className={`no-overflow-text md:mb-[2px] mb-0 ${type === "artist" && "text-center"}`}>
                { headerText }
            </HeaderTag>
            {
                type !== "artist" && (
                    <p className="font-text text-primary-60 xl:text-xs md:text-2xs text-3xs no-overflow-text">
                        { artist } { song && "• " + album }
                    </p>
                )
            }
        </Container>
    )
}

export default EntityBlock