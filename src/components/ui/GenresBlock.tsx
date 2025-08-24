import Overlay from "./Overlay.tsx";
import Icon from "./Icon.tsx";

interface TopGenresProps {
    isTop: boolean
    name: string
}

const TopGenres = ({isTop, name}: TopGenresProps) => {
    return (
        <div className="inline-block w-fit p-[1px] relative rounded-2xl gradient-border">
            <Overlay offset={1} radius={9} isTransparent={false} />

            <p className={`font-text font-medium ${isTop ? "text-primary" : "text-primary-60"} text-xs px-6 py-2 relative flex items-center gap-2`}>
                { isTop && <Icon name="throne" className="fill-none stroke-2 stroke-primary w-[19px] h-[19px]"/> }
                { name }
            </p>
        </div>
    )
}

export default TopGenres