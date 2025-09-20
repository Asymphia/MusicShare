import Icon from "../ui/Icon.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"

const FeaturedSliderButtons = () => {
    const iconStyles = "xl:w-8 xl:h-8 w-7 h-7 stroke-primary-60 stroke-2 fill-primary-60 cursor-pointer hover:stroke-primary-80 hover:fill-primary-80 active:stroke-primay active:fill-primary"
    const width = useWindowWidth()

    return (
        <div className="flex flex-nowrap space-x-3">
            <Icon size={ width >= 1280 ? 32 : 28 } name="previousFeatured" className={iconStyles}/>
            <Icon size={ width >= 1280 ? 32 : 28 } name="nextFeatured" className={iconStyles}/>
        </div>
    )
}

export default FeaturedSliderButtons