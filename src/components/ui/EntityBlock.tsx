import Overlay from "./Overlay.tsx"
import { type JSX } from "react"

interface EntityBlockProps {
    image: string
    type: "album" | "song" | "artist"
    song?: string
    album?: string
    artist?: string
    headerAs?: "h4" | "h5"
}

const EntityBlock = ({ image, type, album, artist, song, headerAs = "h4" }: EntityBlockProps) => {
    const HeaderTag = headerAs as keyof JSX.IntrinsicElements
    const headerText = type === "album" ? album : type === "song" ? song : artist

    return (
        <div>
            <div className={`aspect-square relative p-[2px] ${headerAs === "h4" ? "mb-3" : "mb-2"} ${ type === "artist" ? "rounded-full" : "rounded-3xl" } gradient-border`}>
                <img src={image} alt={song ? song : album} className={`w-full aspect-square ${ type === "artist" ? "rounded-full" : "rounded-[18px]" }`} />

                <Overlay offset={2} radius={type === "artist" ? 1000 : 18} />
            </div>
            <HeaderTag className={`no-overflow-text mb-[2px] ${type === "artist" && "text-center"}`}>
                { headerText }
            </HeaderTag>
            {
                type !== "artist" && (
                    <p className="font-text text-primary-60 text-xs no-overflow-text">
                        { artist } { song && "• " + album }
                    </p>
                )
            }
        </div>
    )
}

export default EntityBlock