import SectionHeader from "../ui/SectionHeader.tsx"
import ExtendedEntityBlock from "../ui/ExtendedEntityBlock.tsx"
import songPlaceholder from "../../assets/placeholders/song-placeholder.png"
import Loader from "../ui/Loader.tsx"
import GenresBlock from "../ui/GenresBlock.tsx"
import EntityBlock from "../ui/EntityBlock.tsx"
import artistPlaceholder from "../../assets/placeholders/artist-placeholder.png"
import { useCallback } from "react"
import { fetchTopSongs, selectTopSongs, selectTopSongsStatus } from "../../features/songs/topSongsSlice.ts"
import { fetchTopArtists, selectTopArtists, selectTopArtistsStatus } from "../../features/artists/artistsSlice.ts"
import { fetchTopGenres, selectTopGenres, selectTopGenresStatus } from "../../features/genres/genresSlice.ts"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import Error from "../ui/Error.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"
import { fetchTopAlbums, selectTopAlbums, selectTopAlbumsStatus } from "../../features/albums/topAlbumsSlice.ts"

const TopStats = () => {
    const width = useWindowWidth()

    const dispatch = useAppDispatch()

    const topSongs = useAppSelector(selectTopSongs)
    const topSongsStatus = useAppSelector(selectTopSongsStatus)

    const topArtists = useAppSelector(selectTopArtists)
    const topArtistsStatus = useAppSelector(selectTopArtistsStatus)

    const topGenres = useAppSelector(selectTopGenres)
    const topGenresStatus = useAppSelector(selectTopGenresStatus)

    const topAlbums = useAppSelector(selectTopAlbums)
    const topAlbumsStatus = useAppSelector(selectTopAlbumsStatus)

    const handleRetryTopSongs = useCallback(() => {
        dispatch(fetchTopSongs())
    }, [dispatch])

    const handleRetryTopArtists = useCallback(() => {
        dispatch(fetchTopArtists())
    }, [dispatch])

    const handleRetryTopGenres = useCallback(() => {
        dispatch(fetchTopGenres())
    }, [dispatch])

    const handleRetryTopAlbums = useCallback(() => {
        dispatch(fetchTopAlbums())
    }, [dispatch])

    const Loading = () => (
        <div className="col-span-2 flex items-center justify-center">
            <Loader size={48} stroke={4}/>
        </div>
    )

    const artistsToShow = width >= 1280 ? topArtists : width >= 1024 ? topArtists?.slice(0, 3) : width < 640 ? topArtists?.slice(0, 4) : topArtists

    return (
        <section className="space-y-7">
            <SectionHeader title="Your TOP of the TOP" as="h3"/>

            <div className="grid xl:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 grid-cols-1 xl:gap-3 gap-7">
                <div>
                    <SectionHeader title="Songs" as="h4" className="!mb-2"/>

                    <div className="space-y-3">
                        {
                            topSongsStatus === "succeeded" && topSongs?.songs.length === 0 && (
                                <p className="font-text md:text-xs text-2xs text-primary-60">
                                    No top songs found. Listen to more songs in order to display your top list.
                                </p>
                            )
                        }

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
                            topAlbumsStatus === "succeeded" && topAlbums?.length === 0 && (
                                <p className="font-text md:text-xs text-2xs text-primary-60">
                                    No top albums found. Listen to more songs in order to display your top list.
                                </p>
                            )
                        }

                        {
                            topAlbumsStatus === "succeeded" && topAlbums?.map((album, id) => (
                                <ExtendedEntityBlock id={id} key={album.spotifyId} isTop={true} image={album.coverImageUrl}
                                                     type="album" artist="KORNEL" album={album.name} duration={2} songAmount={14} />
                            ))
                        }

                        { topAlbumsStatus === "loading" && <Loading /> }

                        { topAlbumsStatus === "failed" && <Error text="top albums" handleRetry={ handleRetryTopAlbums } buttonClassName="!py-2" /> }
                    </div>
                </div>
            </div>

            <div>
                <SectionHeader title="Genres" as="h4" className="!mb-2"/>

                <div className="flex flex-wrap gap-3">
                    {
                        topGenresStatus === "succeeded" && topGenres?.length === 0 && (
                            <p className="font-text text-xs text-primary-60">
                                No top genres found. Listen to more songs in order to display your top list.
                            </p>
                        )
                    }

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

                <div className="grid xl:grid-cols-7 lg:grid-cols-3 sm:grid-cols-7 grid-cols-4 gap-3">
                    {
                        topArtistsStatus === "succeeded" && topArtists?.length === 0 && (
                            <p className="font-text text-xs text-primary-60 col-span-7">
                                No top artists found. Listen to more songs in order to display your top list.
                            </p>
                        )
                    }

                    {
                        topArtistsStatus === "succeeded" && artistsToShow?.map(artist => (
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