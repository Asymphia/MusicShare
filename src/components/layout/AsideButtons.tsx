import Icon from "../ui/Icon.tsx"
import { usePlayer } from "../../hooks/usePlayer"
import {useEffect, useState} from "react"

const AsideButtons = () => {
    const { volume, setVolume, isMuted, toggleMute } = usePlayer()
    const [localPct, setLocalPct] = useState<number>(Math.round((volume ?? 1) * 100))

    useEffect(() => {
        setLocalPct(Math.round((volume ?? 1) * 100))
    }, [volume])

    return (
        <div className="hidden sm:flex flex-nowrap xl:flex-row flex-col xl:space-x-4 items-center justify-self-end">
            <div className="flex-nowrap space-x-3 items-center cursor-pointer group xl:flex hidden">
                <button type="button" onClick={toggleMute} className="cursor-pointer">
                    <Icon name={ isMuted ? "muted" : "volume" } size={ 16 } className="h-4 w-4 fill-primary-60 group-hover:fill-primary-80 group-active:fill-primary" />
                </button>

                <div className="w-20 relative">
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={localPct}
                        onChange={(e) => {
                            const pct = Number(e.target.value)
                            setLocalPct(pct)
                            setVolume(pct / 100)
                        }}
                        className="volume-slider"
                        style={{ ['--value' as any]: `${localPct}%` }}
                    />
                    <div className="absolute h-1 inset-0 bg-accent" style={{ width: `${localPct}%` }}  />
                </div>
            </div>
        </div>
    )
}

export default AsideButtons