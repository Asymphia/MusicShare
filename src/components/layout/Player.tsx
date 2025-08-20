import SongControls from "./SongControls.tsx"
import AsideButtons from "./AsideButtons.tsx"
import CurrentlyPlayingSong from "./CurrentlyPlayingSong.tsx"

const Player = () => {
    return (
        <div className="w-screen px-4 py-2 flex flex-nowrap justify-between items-center">
            <CurrentlyPlayingSong />
            <SongControls />
            <AsideButtons />
        </div>
    )
}

export default Player