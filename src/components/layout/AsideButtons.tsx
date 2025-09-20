import Icon from "../ui/Icon.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"

const AsideButtons = () => {
    const width = useWindowWidth()

    return (
        <div className="hidden sm:flex flex-nowrap xl:flex-row flex-col xl:space-x-4 items-center justify-self-end">
            <Icon name="share" size={ width >= 768 ? 16 : 12 } className="md:h-4 md:w-4 h-3 w-3 fill-primary-60 hover:fill-primary cursor-pointer" />
            <Icon name="download" size={ width >= 768 ? 16 : 12 } className="md:h-4 md:w-4 h-3 w-3 fill-primary-60 hover:fill-primary cursor-pointer xl:mt-0 mt-3" />

            <div className="flex-nowrap space-x-3 items-center cursor-pointer group xl:flex hidden">
                <Icon name="volume" size={ 16 } className="h-4 w-4 fill-primary-60 group-hover:fill-primary" />
                <hr className="border-0 h-1 bg-primary-60 rounded-full w-20"/>
            </div>
        </div>
    )
}

export default AsideButtons