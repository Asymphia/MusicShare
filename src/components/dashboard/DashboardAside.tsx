import SectionHeader from "../ui/SectionHeader.tsx"
import photo from "../../assets/placeholders/placeholder-image.jpg"
import ExtendedEntityBlock from "../ui/ExtendedEntityBlock.tsx"
import GenresBlock from "../ui/GenresBlock.tsx"
import EntityBlock from "../ui/EntityBlock.tsx"
import RecentlyPlayed from "./RecentlyPlayed.tsx"
import SeeAllButton from "../ui/SeeAllButton.tsx"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import { fetchPlaylists, selectPlaylists, selectPlaylistsStatus } from "../../features/playlists/playlistsSlice.ts"
import Loader from "../ui/Loader.tsx"
import bug from "../../assets/icons/bug.svg"
import albumCoverPlaceholder from "../../assets/placeholders/album-cover-placeholder.png"
import FeaturedButton from "../ui/FeaturedButton.tsx"
import { useCallback } from "react"
import {
    fetchListeningHistory, selectListeningHistoryItems,
    selectListeningHistoryStatus
} from "../../features/listeningHistory/listeningHistorySlice.ts"
import {fetchTopSongs, selectTopSongs, selectTopSongsStatus} from "../../features/songs/songsSlice.ts";

const albums = [
    { id: 1, image: photo, title: "Skeleta", artist: "Ghost", duration: 15, songAmount: 10 },
    { id: 2, image: photo, title: "Take me back toasdasd Eden", artist: "Sleep token", duration: 15, songAmount: 10 },
    { id: 3, image: photo, title: "Lo-files", artist: "Bring me the horizon", duration: 15, songAmount: 10 },
    { id: 4, image: photo, title: "Life is killing me", artist: "Type o negative", duration: 15, songAmount: 10 },
    { id: 5, image: photo, title: "Ju Ju", artist: "Siouxsie and the Banshees", duration: 15, songAmount: 10 },
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

const DashboardAside = () => {
    const dispatch = useAppDispatch()

    const playlists = useAppSelector(selectPlaylists)
    const playlistsStatus = useAppSelector(selectPlaylistsStatus)

    const historyItems = useAppSelector(selectListeningHistoryItems)
    const historyStatus = useAppSelector(selectListeningHistoryStatus)

    const topSongs = useAppSelector(selectTopSongs)
    const topSongsStatus = useAppSelector(selectTopSongsStatus)

    const handleRetryPlaylists = useCallback(() => {
        dispatch(fetchPlaylists())
    }, [dispatch])

    const handleRetryHistory = useCallback(() => {
        dispatch(fetchListeningHistory(3))
    }, [dispatch])

    const handleRetryTopSongs = useCallback(() => {
        dispatch(fetchTopSongs())
    }, [dispatch])

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
                                topSongsStatus === "succeeded" && topSongs?.songs.map(song => (
                                    <ExtendedEntityBlock key={song.spotifyId} isTop={true} image={song.coverImageUrl} type="song"
                                                        song={song.title} artist={song.artist} album={song.album} />
                                ))
                            }

                            {
                                topSongsStatus === "loading" && (
                                    <div className="col-span-2 flex items-center justify-center">
                                        <Loader size={48} stroke={4} />
                                    </div>
                                )
                            }

                            {
                                topSongsStatus === "failed" && (
                                    <div className="font-text text-primary-60 text-xs ">
                                        <div className="flex flex-nowrap items-center gap-3 mb-3">
                                            <img src={bug} className="w-6" alt="error" />
                                            Failed to load top songs :(
                                        </div>

                                        <FeaturedButton text="Retry" className="!py-2" onClick={handleRetryTopSongs}/>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div>
                        <SectionHeader title="Albums" as="h4" className="!mb-2" />

                        <div className="space-y-3">
                            {
                                albums.slice(0, 3).map(album => (
                                    <ExtendedEntityBlock id={album.id} key={album.id} isTop={true} image={album.image} type="album"
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
                        historyStatus === "loading" && (
                            <div className="col-span-2 flex items-center justify-center">
                                <Loader size={48} stroke={4} />
                            </div>
                        )
                    }

                    {
                        historyStatus === "failed" && (
                            <div className="font-text text-primary-60 text-xs ">
                                <div className="flex flex-nowrap items-center gap-3 mb-3">
                                    <img src={bug} className="w-6" alt="error" />
                                    Failed to load history :(
                                </div>

                                <FeaturedButton text="Retry" className="!py-2" onClick={handleRetryHistory}/>
                            </div>
                        )
                    }

                    {
                        historyStatus === "succeeded" && historyItems.length === 0 && (
                            <div className="font-text text-primary-60 text-xs">
                                No recently played tracks.
                            </div>
                        )
                    }

                    {
                        historyStatus === "succeeded" && historyItems.map(item => (
                            <RecentlyPlayed key={item.id} title={item.songShort?.title ?? "Unknown"} playlistId={item.playlistShort?.id ?? null} playlist={item.playlistShort?.name ?? "—"} genre={item.genreShortModelDTO?.map(g => g.name).join(", ") || "unknown"} cover={item.songShort?.coverImageUrl ?? photo} length={ item.songShort?.songLengthInSeconds ? `${Math.floor((item.songShort.songLengthInSeconds ?? 0) / 60)}:${String((item.songShort.songLengthInSeconds ?? 0) % 60).padStart(2, "0")}` : ""} />
                        ))
                    }
                </div>
            </section>

            {/* Playlists */}
            <section>
                <SectionHeader title="Come back to us" as="h3" right={<SeeAllButton link="/playlists" />}/>

                <div className="grid grid-cols-2 gap-3">
                    {
                        playlistsStatus === "loading" && (
                            <div className="col-span-2 flex items-center justify-center">
                                <Loader size={48} stroke={4} />
                            </div>
                        )
                    }

                    {
                        playlistsStatus === "succeeded" && playlists.slice(0, 6).map(playlist => (
                            <ExtendedEntityBlock id={playlist.id} key={playlist.id} isTop={false} image={playlist.coverImageUrl ?? albumCoverPlaceholder} type="playlist" playlist={playlist.name} duration={0} creator={playlist.ownerName ?? "Unknown"} songAmount={playlist.songs ? playlist.songs.length : 0} />
                        ))
                    }

                    {
                        playlistsStatus === "failed" && (
                            <div className="col-span-2 font-text text-primary-60 text-xs ">
                                <div className="flex flex-nowrap items-center gap-3 mb-3">
                                    <img src={bug} className="w-6" alt="error" />
                                    Failed to load playlists :(
                                </div>

                                <FeaturedButton text="Retry" className="!py-2" onClick={handleRetryPlaylists} />
                            </div>
                        )
                    }
                </div>
            </section>
        </div>
    )
}

export default DashboardAside