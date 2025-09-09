import SectionHeader from "../ui/SectionHeader.tsx"
import FeaturedSliderButtons from "./FeaturedSliderButtons.tsx"
import Featured from "./Featured.tsx"
import photo from "../../assets/placeholders/placeholder-image.jpg"
import EntityBlock from "../ui/EntityBlock.tsx"

const albums = [
    { id: 1, image: photo, title: "Skeleta", artist: "Ghost", duration: 15, songAmount: 10 },
    { id: 2, image: photo, title: "Take me back toasdasd Eden", artist: "Sleep token", duration: 15, songAmount: 10 },
    { id: 3, image: photo, title: "Lo-files", artist: "Bring me the horizon", duration: 15, songAmount: 10 },
    { id: 4, image: photo, title: "Life is killing me", artist: "Type o negative", duration: 15, songAmount: 10 },
    { id: 5, image: photo, title: "Ju Ju", artist: "Siouxsie and the Banshees", duration: 15, songAmount: 10 },
]

const songs = [
    { id: 1, image: photo, title: "Satanized", artist: "Ghost", album: "Skeleta" },
    { id: 2, image: photo, title: "The Summoning", artist: "Sleep token", album: "Take me back to Eden" },
    { id: 3, image: photo, title: "koolaid.xxo", artist: "Bring me the horizon", album: "Lo-files" },
    { id: 4, image: photo, title: "I don't wanna be", artist: "Type o negative", album: "Life is killing me" },
    { id: 5, image: photo, title: "Arabian Knights", artist: "Siouxsie and the Banshees", album: "Ju Ju" },
]

const artists = [
    { id: 1, image: photo, name: "System of Down" },
    { id: 2, image: photo, name: "Slipknot" },
    { id: 3, image: photo, name: "Joy Division" },
    { id: 4, image: photo, name: "Radiohead" },
    { id: 5, image: photo, name: "Depeche Mode" },
]

const DashboardMain = () => {
    return (
        <div className=" space-y-14">
            {/* Featured */}
            <section>
                <SectionHeader title="Featured" as="h1" right={<FeaturedSliderButtons/>}/>
                <Featured/>
            </section>

            {/* Albums Recommendations */}
            <section>
                <SectionHeader title="You might also like..." as="h2" />
                <div className="w-full grid grid-cols-5 gap-3">
                    {
                        albums.map(album => (
                            <EntityBlock key={album.id} image={album.image} type="album" album={album.title}
                                         artist={album.artist}/>
                        ))
                    }
                </div>
            </section>

            {/* Songs Recommendations */}
            <section>
                <SectionHeader title="Song selected for you..." as="h2" />
                <div className="w-full grid grid-cols-5 gap-3">
                    {
                        songs.map(song => (
                            <EntityBlock key={song.id} image={song.image} type="song" song={song.title}
                                         album={song.album} artist={song.artist}/>
                        ))
                    }
                </div>
            </section>

            {/* Artists Recommendations */}
            <section>
                <SectionHeader title="Artists similar to your favs..." as="h2" />
                <div className="w-full grid grid-cols-5 gap-3">
                    {
                        artists.map(artist => (
                            <EntityBlock key={artist.id} image={artist.image} type="artist" artist={artist.name} />
                        ))
                    }
                </div>
            </section>
        </div>
    )
}

export default DashboardMain