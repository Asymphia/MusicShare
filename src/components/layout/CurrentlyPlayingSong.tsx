import placeholder from "../../assets/placeholders/placeholder-image.jpg"

const CurrentlyPlayingSong = () => {
    return (
        <div className="flex flex-nowrap space-x-6">
            <img src={placeholder} alt="player" className="rounded-2xl w-17 h-17"/>
            <div className="font-text space-y-1">
                <p className="text-s text-primary font-medium">
                    AmEN!
                </p>
                <p className="text-xs text-primary-60">
                    Bring me the Horizon <br/>
                    POST HUMAN: NeX GEn
                </p>
            </div>
        </div>
    )
}

export default CurrentlyPlayingSong