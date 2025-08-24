import SectionHeader from "../ui/SectionHeader.tsx"
import photo from "../../assets/placeholders/placeholder-image.jpg"
import ExtendedEntityBlock from "../ui/ExtendedEntityBlock.tsx"
import GenresBlock from "../ui/GenresBlock.tsx"
import EntityBlock from "../ui/EntityBlock.tsx"
import RecentlyPlayed from "./RecentlyPlayed.tsx"
import SeeAllButton from "../ui/SeeAllButton.tsx"

const albums = [
    { id: 1, image: photo, title: "Skeleta", artist: "Ghost", duration: 15, songAmount: 10 },
    { id: 2, image: photo, title: "Take me back toasdasd Eden", artist: "Sleep token", duration: 15, songAmount: 10 },
    { id: 3, image: photo, title: "Lo-files", artist: "Bring me the horizon", duration: 15, songAmount: 10 },
    { id: 4, image: photo, title: "Life is killing me", artist: "Type o negative", duration: 15, songAmount: 10 },
    { id: 5, image: photo, title: "Ju Ju", artist: "Siouxsie and the Banshees", duration: 15, songAmount: 10 },
]

const songs = [
    { id: 1, image: photo, title: "Satanized", artist: "Ghost", album: "Skeleta", length: "3:14" },
    { id: 2, image: photo, title: "The Summoning", artist: "Sleep token", album: "Take me back to Eden", length: "3:14" },
    { id: 3, image: photo, title: "koolaid.xxo", artist: "Bring me the horizon", album: "Lo-files", length: "3:14" },
    { id: 4, image: photo, title: "I don't wanna be", artist: "Type o negative", album: "Life is killing me", length: "3:14" },
    { id: 5, image: photo, title: "Arabian Knights", artist: "Siouxsie and the Banshees", album: "Ju Ju", length: "3:14" },
]

const artists = [
    { id: 1, image: photo, name: "System of Down" },
    { id: 2, image: photo, name: "Slipknot" },
    { id: 3, image: photo, name: "Joy Division" },
    { id: 4, image: photo, name: "Radiohead" },
    { id: 5, image: photo, name: "Depeche Mode" }
]

const genres = [
    "Black metal", "K-pop", "Hypercore", "Post punk", "R&B", "Country", "New Wave", "J-rock", "Lo-Fi"
]

const playlists = [
    { id: "1", cover: photo, authors: ["Julka", "Kornel"], songsNum: 21, duration: 120, title: "abcd" },
    { id: "2", cover: photo, authors: ["Julka", "Kornel"], songsNum: 21, duration: 120, title: "abcd" },
    { id: "3", cover: photo, authors: ["Julka", "Kornel"], songsNum: 21, duration: 120, title: "abcd" },
    { id: "4", cover: photo, authors: ["Julka", "Kornel"], songsNum: 21, duration: 120, title: "abcd" },
    { id: "5", cover: photo, authors: ["Julka", "Kornel"], songsNum: 21, duration: 120, title: "abcd" },
    { id: "6", cover: photo, authors: ["Julka", "Kornel"], songsNum: 21, duration: 120, title: "abcd" },
]

const DashboardAside = () => {
    return (
        <div className="space-y-14">

            {/* Top stats */}
            <section className="space-y-7">
                <SectionHeader title="Your TOP of the TOP" as="h3" />

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <SectionHeader title="Songs" as="h4" className="!mb-2" />

                        <div className="space-y-3">
                            {
                                songs.slice(0, 3).map(song => (
                                    <ExtendedEntityBlock key={song.id} isTop={true} image={song.image} type="song"
                                                         song={song.title} artist={song.artist} album={song.album} />
                                ))
                            }
                        </div>
                    </div>

                    <div>
                        <SectionHeader title="Albums" as="h4" className="!mb-2" />

                        <div className="space-y-3">
                            {
                                albums.slice(0, 3).map(album => (
                                    <ExtendedEntityBlock key={album.id} isTop={true} image={album.image} type="album"
                                                         artist={album.artist} album={album.title}  duration={album.duration} songAmount={album.songAmount} />
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div>
                    <SectionHeader title="Genres" as="h4" className="!mb-2" />

                    <div className="flex flex-wrap gap-3">
                        {
                            genres.map((genre, index) => (
                                <GenresBlock key={index} name={genre} isTop={index < 3} />
                            ))
                        }
                    </div>
                </div>

                <div>
                    <SectionHeader title="Artists" as="h4" className="!mb-2" />

                    <div className="grid grid-cols-5 gap-3">
                        {
                            artists.map(artist => (
                                <EntityBlock image={artist.image} type="artist" artist={artist.name} key={artist.id} headerAs="h5" />
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* Recently Played */}
            <section>
                <SectionHeader title="Recently played" as="h3" />

                <div className="space-y-3">
                    {
                        songs.map(song => (
                            <RecentlyPlayed title={song.title} artist={song.artist} album={song.album} cover={song.image} length={song.length} />
                        ))
                    }
                </div>
            </section>

            {/* Playlists */}
            <section>
                <SectionHeader title="Come back to us" as="h3" right={<SeeAllButton />} />

                <div className="grid grid-cols-2 gap-3">
                    {
                        playlists.map(playlist => (
                            <ExtendedEntityBlock key={playlist.id} isTop={false} image={playlist.cover} type="playlist" playlist={playlist.title} duration={playlist.duration} creators={playlist.authors} songAmount={playlist.songsNum} />
                        ))
                    }
                </div>
            </section>
        </div>
    )
}

export default DashboardAside