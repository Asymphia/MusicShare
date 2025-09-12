import SectionHeader from "../ui/SectionHeader.tsx"
import ExtendedEntityBlock from "../ui/ExtendedEntityBlock.tsx"
import songPlaceholder from "../../assets/placeholders/song-placeholder.png"
import Loader from "../ui/Loader.tsx"
import GenresBlock from "../ui/GenresBlock.tsx"
import EntityBlock from "../ui/EntityBlock.tsx"
import artistPlaceholder from "../../assets/placeholders/artist-placeholder.png"
import { useCallback } from "react"
import { fetchTopSongs, selectTopSongs, selectTopSongsStatus } from "../../features/songs/songsSlice.ts"
import { fetchTopArtists, selectTopArtists, selectTopArtistsStatus } from "../../features/artists/artistsSlice.ts"
import { fetchTopGenres, selectTopGenres, selectTopGenresStatus } from "../../features/genres/genresSlice.ts"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import photo from "../../assets/placeholders/placeholder-image.jpg"
import Error from "../ui/Error.tsx"

const albums = [
    { id: 1, image: photo, title: "Skeleta", artist: "Ghost", duration: 15, songAmount: 10 },
    { id: 2, image: photo, title: "Take me back toasdasd Eden", artist: "Sleep token", duration: 15, songAmount: 10 },
    { id: 3, image: photo, title: "Lo-files", artist: "Bring me the horizon", duration: 15, songAmount: 10 },
    { id: 4, image: photo, title: "Life is killing me", artist: "Type o negative", duration: 15, songAmount: 10 },
    { id: 5, image: photo, title: "Ju Ju", artist: "Siouxsie and the Banshees", duration: 15, songAmount: 10 },
]

const TopStats = () => {
    const dispatch = useAppDispatch()

    const topSongs = useAppSelector(selectTopSongs)
    const topSongsStatus = useAppSelector(selectTopSongsStatus)

    const topArtists = useAppSelector(selectTopArtists)
    const topArtistsStatus = useAppSelector(selectTopArtistsStatus)

    const topGenres = useAppSelector(selectTopGenres)
    const topGenresStatus = useAppSelector(selectTopGenresStatus)

    const handleRetryTopSongs = useCallback(() => {
        dispatch(fetchTopSongs())
    }, [dispatch])

    const handleRetryTopArtists = useCallback(() => {
        dispatch(fetchTopArtists())
    }, [dispatch])

    const handleRetryTopGenres = useCallback(() => {
        dispatch(fetchTopGenres())
    }, [dispatch])

    const Loading = () => (
        <div className="col-span-2 flex items-center justify-center">
            <Loader size={48} stroke={4}/>
        </div>
    )

    return (
        <section className="space-y-7">
            <SectionHeader title="Your TOP of the TOP" as="h3"/>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <SectionHeader title="Songs" as="h4" className="!mb-2"/>

                    <div className="space-y-3">
                        {
                            topSongsStatus === "succeeded" && topSongs?.songs.map(song => (
                                <ExtendedEntityBlock key={song.spotifyId} isTop={true}
                                                     image={song.coverImageUrl ?? songPlaceholder} type="song"
                                                     song={song.title} artist={song.artist} album={song.album}/>
                            ))
                        }

                        { topSongsStatus === "loading" && <Loading /> }

                        { topSongsStatus === "failed" && <Error text="top songs" handleRetry={ handleRetryTopSongs } buttonClassName="!py-2" /> }
                    </div>
                </div>

                <div>
                    <SectionHeader title="Albums" as="h4" className="!mb-2"/>

                    <div className="space-y-3">
                        {
                            albums.slice(0, 3).map(album => (
                                <ExtendedEntityBlock id={album.id} key={album.id} isTop={true} image={album.image}
                                                     type="album"
                                                     artist={album.artist} album={album.title} duration={album.duration}
                                                     songAmount={album.songAmount}/>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div>
                <SectionHeader title="Genres" as="h4" className="!mb-2"/>

                <div className="flex flex-wrap gap-3">
                    {
                        topGenresStatus === "succeeded" && topGenres?.map((genre, index) => (
                            <GenresBlock key={genre.id} isTop={index < 3} name={genre.name}/>
                        ))
                    }

                    { topGenresStatus === "loading" && <Loading /> }

                    { topGenresStatus === "failed" && <Error text="top genres" handleRetry={ handleRetryTopGenres } buttonClassName="!py-2" /> }
                </div>
            </div>

            <div>
                <SectionHeader title="Artists" as="h4" className="!mb-2"/>

                <div className="grid grid-cols-7 gap-3">
                    {
                        topArtistsStatus === "succeeded" && topArtists?.map(artist => (
                            <EntityBlock key={artist.spotifyId} artist={artist.name}
                                         image={artist.imageUrl ?? artistPlaceholder} type="artist" headerAs="h5"/>
                        ))
                    }

                    { topArtistsStatus === "loading" && <Loading /> }

                    { topArtistsStatus === "failed" && <Error text="top artists" handleRetry={ handleRetryTopArtists } buttonClassName="!py-2" /> }
                </div>
            </div>
        </section>
    )
}

export default TopStats