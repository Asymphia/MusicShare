import noise from "../../assets/icons/noise.svg"
import Icon from "../ui/Icon.tsx"

const SongControls = () => {
    return (
        <div className="flex flex-col items-center space-y-1">
            <div className="flex flex-nowrap space-x-10 items-center">
                <Icon name="previous" className="h-5 w-5 fill-primary-60 hover:fill-primary cursor-pointer" />

                <div className="relative w-10 h-10 flex items-center justify-center group cursor-pointer">
                    <img src={ noise } alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 pointer-events-none"/>
                    <Icon name="pause" className="h-5 w-5 fill-primary-60 group-hover:fill-primary" />
                </div>

                <Icon name="next" className="h-5 w-5 fill-primary-60 hover:fill-primary cursor-pointer" />
            </div>

            <div className="font-text text-primary-60 text-xs flex items-center space-x-3">
                <p> 0:00 </p>

                <hr className="border-0 h-1 bg-primary-60 rounded-full w-200"/>

                <p> 3:09 </p>
            </div>
        </div>
    )
}

export default SongControls