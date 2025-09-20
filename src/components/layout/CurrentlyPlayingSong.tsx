import placeholder from "../../assets/placeholders/placeholder-image.jpg"

const CurrentlyPlayingSong = () => {
    return (
        <div className="flex flex-nowrap xl:space-x-6 space-x-2">
            <img src={placeholder} alt="player" className="rounded-2xl xl:w-17 xl:h-17 md:h-15 md:w-15 w-13 h-13"/>
            <div className="font-text space-y-1">
                <p className="xl:text-s md:text-xs text-2xs text-primary font-medium">
                    AmEN!
                </p>
                <p className="xl:text-xs md:text-2xs text-3xs text-primary-60">
                    Bring me the Horizon <br/>
                    POST HUMAN: NeX GEn
                </p>
            </div>
        </div>
    )
}

export default CurrentlyPlayingSong