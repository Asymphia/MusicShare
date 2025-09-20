import Overlay from "./Overlay.tsx"
import Icon from "./Icon.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"

interface TopGenresProps {
    isTop: boolean
    name: string
}

const TopGenres = ({isTop, name}: TopGenresProps) => {
    const width = useWindowWidth()

    return (
        <div className="inline-block w-fit p-[1px] relative rounded-2xl gradient-border">
            <Overlay offset={1} radius={9} isTransparent={false} />

            <p className={`font-text font-medium ${isTop ? "text-primary" : "text-primary-60"} xl:text-xs md:text-2xs text-3xs xl:px-6 md:px-4 px-3 md:py-2 py-2 relative flex items-center gap-2`}>
                { isTop && <Icon name="throne" size={ width >= 1280 ? 19 : width >= 768 ? 15 : 13 } className="fill-none stroke-2 stroke-primary xl:w-[19px] xl:h-[19px] md:w-[15px] md:h-[15px] w-[13px] h-[13px] "/> }
                { name }
            </p>
        </div>
    )
}

export default TopGenres