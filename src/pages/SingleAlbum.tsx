import SinglePlaylistHeader from "../components/playlist/SinglePlaylistHeader"
import placeholder from "../assets/placeholders/album-cover-placeholder.png"
import { Navigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchAlbumById, selectAlbumById, selectAlbumsSongsStatus } from "../features/albums/albumsSlice"
import {useCallback, useEffect} from "react"
import Loader from "../components/ui/Loader"
import Error from "../components/ui/Error"
import SongListItem from "../components/playlist/SongListItem"

const SingleAlbum = () => {
    const { slug } = useParams<{ slug: string }>()
    const id = String(slug)
    const dispatch = useAppDispatch()

    if(!id) return <Navigate to="/404" replace />

    const album = useAppSelector(state => selectAlbumById(state, id))
    const songsStatus = useAppSelector(state => selectAlbumsSongsStatus(state, id))

    useEffect(() => {
        if(songsStatus === "idle" || songsStatus === "failed") {
            dispatch(fetchAlbumById(id))
        }
    }, [dispatch, id, songsStatus])

    const handleRetryAlbum = useCallback(() => {
        dispatch(fetchAlbumById(id))
    }, [dispatch])

    if(!album && songsStatus !== "loading" && songsStatus !== "idle") return <Navigate to="/404" replace />

    if (!album || songsStatus === "loading") {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Loader size={96} stroke={5} />
            </div>
        )
    }

    if (songsStatus === "failed") return <Error text="album" handleRetry={ handleRetryAlbum } buttonClassName="!py-2" />

    const songs = album.songs ?? []

    return (
        <div className="grid sm:grid-cols-3 grid-cols-1 xl:gap-14 lg:gap-10 md:gap-8 sm:gap-6 gap-4">
            <div className="sm:col-span-1 self-start h-full">
                <SinglePlaylistHeader title={album.name} image={album.coverImageUrl || placeholder}
                                      songAmount={album.songs?.length || 0} duration={0} author={album.artist?.name || "Unknown"} />
            </div>

            <div className="sm:col-span-2 space-y-3">
                {
                    songs.length > 0 ? songs.map(song => (
                        <SongListItem key={song.spotifyId}
                                      image={song.coverImageUrl ?? album.coverImageUrl ?? placeholder} song={song.title ?? "Unknown title"} artist={song.displayArtist ?? song.artist ?? "Unknown artist"} album={song.displayAlbum || "Unknown album"} length={"0:00"} added={song.releaseDate || "Unknown"} />
                    )) : (
                        <p className="font-text text-primary-60 xl:text-xs md:text-2xs text-3xs">There is no songs in this playlist :(</p>
                    )
                }
            </div>
        </div>
    )
}

export default SingleAlbum