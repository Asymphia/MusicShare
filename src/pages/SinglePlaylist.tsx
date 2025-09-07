import SinglePlaylistHeader from "../components/playlist/SinglePlaylistHeader.tsx"
import { Navigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks.ts"
import { fetchPlaylistById, selectPlaylistById, selectPlaylistSongsStatus } from "../features/playlists/playlistsSlice.ts"
import { useEffect } from "react"
import Loader from "../components/ui/Loader.tsx"
import bug from "../assets/icons/bug.svg"
import FeaturedButton from "../components/ui/FeaturedButton.tsx"
import SongListItem from "../components/playlist/SongListItem.tsx"
import placeholder from "../assets/placeholders/album-cover-placeholder.png"

const formatDate = (iso?: string | null) => {
    if (!iso) return ""
    try {
        const d = new Date(iso)
        return d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
    } catch {
        return iso
    }
}

const SinglePlaylist = () => {
    const { slug } = useParams<{ slug: string }>()
    const id = Number(slug)
    const dispatch = useAppDispatch()

    if (isNaN(id)) {
        return <Navigate to="/404" replace />
    }

    const playlist = useAppSelector(state => selectPlaylistById(state, id))
    const songsStatus = useAppSelector(state => selectPlaylistSongsStatus(state, id))

    useEffect(() => {
        if (songsStatus === "idle" || songsStatus === "failed") {
            dispatch(fetchPlaylistById(id))
        }
    }, [dispatch, id, songsStatus])

    const handleRetryPlaylist = () => {
        dispatch(fetchPlaylistById(id))
    }

    if (!playlist || songsStatus === "loading") {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Loader size={96} stroke={5} />
            </div>
        )
    }

    if (songsStatus === "failed") {
        return (
            <div className="font-text text-primary-60 text-xs ">
                <div className="flex flex-nowrap items-center gap-3 mb-3">
                    <img src={bug} className="w-6" alt="error"/>
                    Failed to load playlist :(
                </div>

                <FeaturedButton text="Retry" className="!py-2" onClick={handleRetryPlaylist}/>
            </div>
        )
    }

    const songs = playlist.songs ?? []
    const headerAuthor = songs[0]?.displayArtist ?? songs[0]?.artist ?? "Various Artists"

    return (
        <div className="grid grid-cols-3 gap-14">
            <div className="col-span-1 self-start h-full">
                    <SinglePlaylistHeader title={playlist.name} image={playlist.coverImageUrl ?? placeholder}
                                          songAmount={songs.length} duration={0} author={headerAuthor}
                                          description={playlist.description ?? "No description yet :("} />
            </div>

            <div className="col-span-2 space-y-3">
                {
                    songs.length > 0 ? songs.map(song => (
                        <SongListItem key={song.spotifyId}
                                      image={song.coverImageUrl ?? playlist.coverUrl ?? placeholder} song={song.title ?? "Unknown title"} artist={song.displayArtist ?? song.artist ?? "Unknown artist"} album={song.displayAlbum ?? song.album ?? ""} length={"0:00"} added={formatDate(song.createdAt ?? song.releaseDate ?? null)} />
                    )) : (
                        <p className="font-text text-primary-60 text-xs">There is no songs in this playlist :(</p>
                    )
                }
            </div>
        </div>
    )
}

export default SinglePlaylist