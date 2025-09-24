import SectionHeader from "../ui/SectionHeader.tsx"
import FeaturedSliderButtons from "./FeaturedSliderButtons.tsx"
import Featured from "./Featured.tsx"
import photo from "../../assets/placeholders/placeholder-image.jpg"
import EntityBlock from "../ui/EntityBlock.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import {
    fetchRecommendedSongs,
    selectRecommendedSongs,
    selectRecommendedSongsStatus
} from "../../features/songs/recommendedSongsSlice.ts"
import { useCallback } from "react"
import songPlaceholder from "../../assets/placeholders/song-placeholder.png"
import Error from "../ui/Error.tsx"
import Loader from "../ui/Loader.tsx"
import {
    fetchRecommendedArtists,
    selectRecommendedArtists,
    selectRecommendedArtistsStatus
} from "../../features/artists/recommendedArtistsSlice.ts"
import artistPlaceholder from "../../assets/placeholders/artist-placeholder.png"

const albums = [
    { id: 1, image: photo, title: "Skeleta", artist: "Ghost", duration: 15, songAmount: 10 },
    { id: 2, image: photo, title: "Take me back toasdasd Eden", artist: "Sleep token", duration: 15, songAmount: 10 },
    { id: 3, image: photo, title: "Lo-files", artist: "Bring me the horizon", duration: 15, songAmount: 10 },
    { id: 4, image: photo, title: "Life is killing me", artist: "Type o negative", duration: 15, songAmount: 10 },
    { id: 5, image: photo, title: "Ju Ju", artist: "Siouxsie and the Banshees", duration: 15, songAmount: 10 },
]

const DashboardMain = () => {
    const width = useWindowWidth()

    const dispatch = useAppDispatch()

    const recommendedSongs = useAppSelector(selectRecommendedSongs)
    const recommendedSongsStatus = useAppSelector(selectRecommendedSongsStatus)

    const recommendedArtists = useAppSelector(selectRecommendedArtists)
    const recommendedArtistsStatus = useAppSelector(selectRecommendedArtistsStatus)

    const handleRetryRecommendedSongs = useCallback(() => {
        dispatch(fetchRecommendedSongs())
    }, [dispatch])

    const handleRetryRecommendedArtists = useCallback(() => {
        dispatch(fetchRecommendedArtists())
    }, [dispatch])

    return (
        <div className="space-y-14 xl:col-span-1 lg:col-span-2">
            {/* Featured */}
            <section>
                <SectionHeader title="Featured" as="h1" right={<FeaturedSliderButtons/>}/>
                <Featured/>
            </section>

            {/* Albums Recommendations */}
            <section>
                <SectionHeader title="You might also like..." as="h2" />
                <div className="w-full grid sm:grid-cols-5 grid-cols-4 gap-3">
                    {
                        albums.slice(0, width < 640 ? 4 : 5).map(album => (
                            <EntityBlock key={album.id} image={album.image} type="album" album={album.title}
                                         artist={album.artist}/>
                        ))
                    }
                </div>
            </section>

            {/* Songs Recommendations */}
            <section>
                <SectionHeader title="Song selected for you..." as="h2" />
                <div className="w-full grid sm:grid-cols-5 grid-cols-4 gap-3">
                    {
                        recommendedSongsStatus === "succeeded" && recommendedSongs?.length === 0 && (
                            <p className="font-text md:text-xs text-2xs text-primary-60 sm:col-span-5 cols-span-4">
                                No recommended songs found. Listen to more songs in order to display your recommended list.
                            </p>
                        )
                    }

                    {
                        recommendedSongsStatus === "succeeded" && recommendedSongs?.slice(0, width < 640 ? 4 : 5).map(song => (
                            <EntityBlock key={song.spotifyId} image={song.coverImageUrl || songPlaceholder} type="song" song={song.title}
                                         album={song.album || "Unknown"} artist={song.artist}/>
                        ))
                    }

                    { recommendedSongsStatus === "loading" && (
                        <div className="sm:col-span-5 cols-span-4">
                            <Loader size={48} stroke={4} />
                        </div>
                    )}

                    { recommendedSongsStatus === "failed" && <Error text="recommended songs" handleRetry={ handleRetryRecommendedSongs } buttonClassName="!py-2" mainClassName="sm:col-span-5 cols-span-4" /> }
                </div>
            </section>

            {/* Artists Recommendations */}
            <section>
                <SectionHeader title="Artists similar to your favs..." as="h2" />
                <div className="w-full grid sm:grid-cols-5 grid-cols-4 gap-3">
                    {
                        recommendedArtistsStatus === "succeeded" && recommendedArtists?.length === 0 && (
                            <p className="font-text md:text-xs text-2xs text-primary-60 sm:col-span-5 cols-span-4">
                                No recommended artists found. Listen to more songs in order to display your recommended list.
                            </p>
                        )
                    }

                    {
                        recommendedArtistsStatus === "succeeded" && recommendedArtists?.slice(0, width < 640 ? 4 : 5).map(artist => (
                            <EntityBlock key={artist.spotifyId} image={artist.imageUrl || artistPlaceholder} type="artist" artist={artist.name} />
                        ))
                    }

                    { recommendedArtistsStatus === "loading" && (
                        <div className="sm:col-span-5 cols-span-4">
                            <Loader size={48} stroke={4} />
                        </div>
                    )}

                    { recommendedArtistsStatus === "failed" && <Error text="recommended artists" handleRetry={ handleRetryRecommendedArtists } buttonClassName="!py-2" mainClassName="sm:col-span-5 cols-span-4" /> }
                </div>
            </section>
        </div>
    )
}

export default DashboardMain