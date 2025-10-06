import Icon from "../ui/Icon.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"

interface FeaturedSliderButtonsProps {
    onClickPrev: () => void
    onClickNext: () => void
}

const FeaturedSliderButtons = ({ onClickPrev, onClickNext }: FeaturedSliderButtonsProps) => {
    const iconStyles = "xl:w-8 xl:h-8 w-7 h-7 transition stroke-primary-60 stroke-2 fill-primary-60 cursor-pointer hover:stroke-primary-80 hover:fill-primary-80 active:stroke-primary active:fill-primary"
    const width = useWindowWidth()

    return (
        <div className="flex flex-nowrap space-x-3">
            <button type="button" onClick={onClickPrev}>
                <Icon size={ width >= 1280 ? 32 : 28 } name="previousFeatured" className={iconStyles} />
            </button>

            <button type="button" onClick={onClickNext}>
                <Icon size={ width >= 1280 ? 32 : 28 } name="nextFeatured" className={iconStyles} />
            </button>
        </div>
    )
}

export default FeaturedSliderButtons