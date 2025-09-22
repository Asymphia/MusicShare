import SectionHeader from "../ui/SectionHeader.tsx"
import Icon from "../ui/Icon.tsx"
import ExtendedEntityBlock from "../ui/ExtendedEntityBlock.tsx"
import songPlaceholder from "../../assets/placeholders/song-placeholder.png"
import FeaturedButton from "../ui/FeaturedButton.tsx"

const SongsForm = () => {


    return (
        <section className="w-1/3 space-y-14 flex flex-col">
            <div>
                <SectionHeader title="Add your favourite songs" as="h4" className="!mb-2"/>

                <p className="font-text text-xs text-primary-60 w-1/2">
                    Choose the best ones.
                </p>
            </div>

            <label
                className="group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80 w-full">
                <Icon size={ 24 } name="search" className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80"/>

                <input type="text" placeholder="Search for a song..."
                       className="font-text text-xs text-primary-60 focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                />
            </label>

            <div className="grid grid-cols-2 w-full gap-4">
                {/*{*/}
                {/*    songs.map(song => (*/}
                {/*        <ExtendedEntityBlock key={song.id} isTop={false} image={song.songShort.coverImageUrl || songPlaceholder} type="song" song={song.songShort.title.length > 10 ? song.songShort.title.slice(0, 10) + "..." : song.songShort.title} artist="Unknown" album={song.playlistShort?.name || "Unknown"} />*/}
                {/*    ))*/}
                {/*}*/}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FeaturedButton text="Previous step" className="justify-center" onClick={() => {}}/>
                <FeaturedButton text="Create playlist" className="justify-center" onClick={() => {}}/>
            </div>
        </section>
    )
}

export default SongsForm