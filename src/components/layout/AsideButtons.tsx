import Icon from "../ui/Icon.tsx"

const AsideButtons = () => {
    return (
        <div className="flex flex-nowrap space-x-4 items-center">
            <Icon name="share" className="h-4 w-4 fill-primary-60 hover:fill-primary cursor-pointer" />
            <Icon name="download" className="h-4 w-4 fill-primary-60 hover:fill-primary cursor-pointer" />

            <div className="flex flex-nowrap space-x-3 items-center cursor-pointer group">
                <Icon name="volume" className="h-4 w-4 fill-primary-60 group-hover:fill-primary" />
                <hr className="border-0 h-1 bg-primary-60 rounded-full w-20"/>
            </div>
        </div>
    )
}

export default AsideButtons