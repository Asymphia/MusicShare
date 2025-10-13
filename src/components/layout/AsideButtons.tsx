import Icon from "../ui/Icon.tsx"

const AsideButtons = () => {
    return (
        <div className="hidden sm:flex flex-nowrap xl:flex-row flex-col xl:space-x-4 items-center justify-self-end">
            <div className="flex-nowrap space-x-3 items-center cursor-pointer group xl:flex hidden">
                <Icon name="volume" size={ 16 } className="h-4 w-4 fill-primary-60 group-hover:fill-primary" />

                <div className="border-0 h-1 bg-primary-60 rounded-full w-20 relative hover:h-1.5 transition-all">
                    <div
                        className="border-0 h-1 bg-accent rounded-full absolute inset-0 pointer-events-none"
                        style={{ width: `50%` }}
                    />
                </div>
            </div>
        </div>
    )
}

export default AsideButtons