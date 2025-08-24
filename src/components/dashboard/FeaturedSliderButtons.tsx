import Icon from "../ui/Icon.tsx"

const FeaturedSliderButtons = () => {
    const iconStyles = "w-8 h-8 stroke-primary-60 stroke-2 fill-primary-60 cursor-pointer hover:stroke-primary-80 hover:fill-primary-80 active:stroke-primay active:fill-primary"

    return (
        <div className="flex flex-nowrap space-x-3">
            <Icon name="previousFeatured" className={iconStyles}/>
            <Icon name="nextFeatured" className={iconStyles}/>
        </div>
    )
}

export default FeaturedSliderButtons