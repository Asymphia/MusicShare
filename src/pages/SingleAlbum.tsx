import SinglePlaylistHeader from "../components/playlist/SinglePlaylistHeader"
import placeholder from "../assets/placeholders/album-cover-placeholder.png"
import { Navigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchAlbumById, selectAlbumById, selectAlbumsSongsStatus } from "../features/albums/albumsSlice"
import {useCallback, useEffect, useRef, useState} from "react"
import Loader from "../components/ui/Loader"
import Error from "../components/ui/Error"
import SongListItem from "../components/playlist/SongListItem"
import SongFilePopup from "../components/ui/SongFilePopup"
import type { PopupHandle } from "../components/ui/Popup"
import { type SongDto } from "../api/songsApi"

const SingleAlbum = () => {
    const { slug } = useParams<{ slug: string }>()
    const id = String(slug)
    const dispatch = useAppDispatch()

    const album = useAppSelector(state => selectAlbumById(state, id))
    const songsStatus = useAppSelector(state => selectAlbumsSongsStatus(state, id))

    const [songId, setSongId] = useState<string | null>(null)
    const popupRef = useRef<PopupHandle | null>(null)

    if(!id) return <Navigate to="/404" replace />

    useEffect(() => {
        if(songsStatus === "idle" || songsStatus === "failed") {
            dispatch(fetchAlbumById(id))
        }
    }, [dispatch, id, songsStatus])

    const handleRetryAlbum = useCallback(() => {
        dispatch(fetchAlbumById(id))
    }, [dispatch])

    if (songsStatus === "failed") return <Error text="album" handleRetry={ handleRetryAlbum } buttonClassName="!py-2" />

    const songs = album?.songs ?? []

    const openPopup = (spotifyId: string) => setSongId(spotifyId)
    const closePopup = () => setSongId(null)

    const modalRoot = typeof document !== "undefined" ? document.getElementById("modal-file") : null

    const selectedSong = songId ? songs.find(s => s.spotifyId === songId) : undefined

    if(!album && songsStatus !== "loading" && songsStatus !== "idle") return <Navigate to="/404" replace />

    if (!album || songsStatus === "loading") {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Loader size={96} stroke={5} />
            </div>
        )
    }

    return (
        <div className="grid sm:grid-cols-3 grid-cols-1 xl:gap-14 lg:gap-10 md:gap-8 sm:gap-6 gap-4">
            <div className="sm:col-span-1 self-start h-full">
                <SinglePlaylistHeader title={album.name} image={album.coverImageUrl || placeholder}
                                      songAmount={album.songs?.length || 0} duration={0} author={album.artist?.name || "Unknown"} />
            </div>

            <div className="sm:col-span-2 space-y-2">
                {
                    songs.length > 0 ? songs.map(song => (
                        <SongListItem key={`SingleAlbumSongs${song.spotifyId}`} onClick={() => openPopup(song.spotifyId)}
                                      songItem={song as SongDto} isAlbum={true} album={song.displayAlbum} length={song.songLengthInSeconds || undefined} />
                    )) : (
                        <p className="font-text text-primary-60 xl:text-xs md:text-2xs text-3xs">There is no songs in this playlist :(</p>
                    )
                }

                <SongFilePopup isOpen={songId !== null} close={closePopup} songId={selectedSong?.spotifyId ?? ""} songName={selectedSong?.title ?? ""} hasFile={Boolean(selectedSong?.hasLocalFile ?? selectedSong?.localSongPath)} ref={popupRef} portalContainer={modalRoot} />
            </div>
        </div>
    )
}

export default SingleAlbum