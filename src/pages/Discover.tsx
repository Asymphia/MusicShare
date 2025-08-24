import SectionHeader from "../components/ui/SectionHeader.tsx";
import photo from "../assets/placeholders/placeholder-image.jpg";
import EntityBlock from "../components/ui/EntityBlock.tsx";

const albums = [
    { id: 1, image: photo, title: "Skeleta", artist: "Ghost", duration: 15, songAmount: 10 },
    { id: 2, image: photo, title: "Take me back toasdasd Eden", artist: "Sleep token", duration: 15, songAmount: 10 },
    { id: 3, image: photo, title: "Lo-files", artist: "Bring me the horizon", duration: 15, songAmount: 10 },
    { id: 4, image: photo, title: "Life is killing me", artist: "Type o negative", duration: 15, songAmount: 10 },
    { id: 5, image: photo, title: "Ju Ju", artist: "Siouxsie and the Banshees", duration: 15, songAmount: 10 },
    { id: 6, image: photo, title: "Ju Ju", artist: "Siouxsie and the Banshees", duration: 15, songAmount: 10 },
    { id: 7, image: photo, title: "Ju Ju", artist: "Siouxsie and the Banshees", duration: 15, songAmount: 10 },
    { id: 8, image: photo, title: "Ju Ju", artist: "Siouxsie and the Banshees", duration: 15, songAmount: 10 }
]

const songs = [
    { id: 1, image: photo, title: "Satanized", artist: "Ghost", album: "Skeleta", length: "3:14" },
    { id: 2, image: photo, title: "The Summoning", artist: "Sleep token", album: "Take me back to Eden", length: "3:14" },
    { id: 3, image: photo, title: "koolaid.xxo", artist: "Bring me the horizon", album: "Lo-files", length: "3:14" },
    { id: 4, image: photo, title: "I don't wanna be", artist: "Type o negative", album: "Life is killing me", length: "3:14" },
    { id: 5, image: photo, title: "Arabian Knights", artist: "Siouxsie and the Banshees", album: "Ju Ju", length: "3:14" },
    { id: 6, image: photo, title: "Arabian Knights", artist: "Siouxsie and the Banshees", album: "Ju Ju", length: "3:14" },
    { id: 7, image: photo, title: "Arabian Knights", artist: "Siouxsie and the Banshees", album: "Ju Ju", length: "3:14" },
    { id: 8, image: photo, title: "Arabian Knights", artist: "Siouxsie and the Banshees", album: "Ju Ju", length: "3:14" }
]

const artists = [
    { id: 1, image: photo, name: "System of Down" },
    { id: 2, image: photo, name: "Slipknot" },
    { id: 3, image: photo, name: "Joy Division" },
    { id: 4, image: photo, name: "Radiohead" },
    { id: 5, image: photo, name: "Depeche Mode" },
    { id: 6, image: photo, name: "Depeche Mode" },
    { id: 7, image: photo, name: "Depeche Mode" },
    { id: 8, image: photo, name: "Depeche Mode" }
]

const Discover = () => {
    return (
        <div className="space-y-14">
            <div>
                <SectionHeader title="Discover" as="h1" />

                <p className="font-text text-xs text-primary-60 w-1/2">
                    Based on your most listened genres, we curate personalized album recommendations that resonate with your unique musical taste. Our algorithm selects songs that complement your favorite styles while introducing you to new artists within your preferred genres. This tailored approach ensures you discover music that truly connects with your listening habits and preferences.
                </p>
            </div>


            <div className="grid grid-cols-2 gap-14">
                <section>
                    <SectionHeader title="Albums you might like" as="h2"/>

                    <div className="grid grid-cols-4 gap-4">
                        {
                            albums.map(album => (
                                <EntityBlock key={album.id} image={album.image} type="album" album={album.title} artist={album.artist} />
                            ))
                        }
                    </div>
                </section>

                <div>
                    <SectionHeader title="Songs you might like" as="h2"/>
                    <section className="grid grid-cols-4 gap-4">
                        {
                            songs.map(song => (
                                <EntityBlock key={song.id} image={song.image} type="song" album={song.album}
                                             artist={song.artist} song={song.title} />
                            ))
                        }
                    </section>
                </div>
            </div>

            <section>
                <SectionHeader title="Artists you might like" as="h2"/>
                <section className="grid grid-cols-8 gap-4">
                    {
                        artists.map(artist => (
                            <EntityBlock key={artist.id} image={artist.image} type="artist" artist={artist.name} />
                        ))
                    }
                </section>
            </section>
        </div>
    )
}

export default Discover