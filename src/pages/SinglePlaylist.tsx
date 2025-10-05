import SinglePlaylistHeader from "../components/playlist/SinglePlaylistHeader.tsx"
import { Navigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks.ts"
import { fetchPlaylistById, selectPlaylistById, selectPlaylistSongsStatus } from "../features/playlists/playlistsSlice.ts"
import {useEffect, useRef, useState} from "react"
import Loader from "../components/ui/Loader.tsx"
import SongListItem from "../components/playlist/SongListItem.tsx"
import placeholder from "../assets/placeholders/album-cover-placeholder.png"
import Error from "../components/ui/Error.tsx"
import SongFilePopup from "../components/ui/SongFilePopup"
import type { PopupHandle } from "../components/ui/Popup"
import { formatDate } from "../lib/date"

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

    if (songsStatus === "failed") return <Error text="playlist" handleRetry={ handleRetryPlaylist } buttonClassName="!py-2" />

    const songs = playlist?.songs ?? []

    const [songId, setSongId] = useState<string | null>(null)
    const popupRef = useRef<PopupHandle | null>(null)

    const openPopup = (spotifyId: string) => setSongId(spotifyId)
    const closePopup = () => setSongId(null)

    const modalRoot = typeof document !== "undefined" ? document.getElementById("modal") : null

    const selectedSong = songId ? songs.find(s => s.spotifyId === songId) : undefined

    if (!playlist && songsStatus !== "loading" && songsStatus !== "idle") {
        return <Navigate to="/404" replace />
    }

    if (!playlist || songsStatus === "loading") {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Loader size={96} stroke={5} />
            </div>
        )
    }

    return (
        <div className="grid sm:grid-cols-3 grid-cols-1 xl:gap-14 lg:gap-10 md:gap-8 sm:gap-6 gap-4">
            <div className="sm:col-span-1 self-start h-full">
                    <SinglePlaylistHeader title={playlist.name} image={playlist.coverImageUrl ?? placeholder}
                                          songAmount={songs.length} duration={0} author={playlist.ownerName || "Unknown author"}
                                          description={playlist.description ?? "No description yet :("} />
            </div>

            <div className="sm:col-span-2 space-y-3">
                {
                    songs.length > 0 ? songs.map(song => (
                        <SongListItem key={song.spotifyId} onClick={() => openPopup(song.spotifyId)}
                                      image={song.coverImageUrl ?? playlist.coverImageUrl ?? placeholder} song={song.title ?? "Unknown title"} artist={song.displayArtist ?? song.artist ?? "Unknown artist"} album={song.displayAlbum ?? song.album ?? ""} length={"0:00"} added={formatDate(song.createdAt ?? song.releaseDate ?? null)} />
                    )) : (
                        <p className="font-text text-primary-60 xl:text-xs md:text-2xs text-3xs">There is no songs in this playlist :(</p>
                    )
                }

                <SongFilePopup isOpen={songId !== null} close={closePopup} songId={selectedSong?.spotifyId ?? ""} songName={selectedSong?.title ?? ""} hasFile={Boolean(selectedSong?.hasLocalFile ?? selectedSong?.localSongPath)} ref={popupRef} portalContainer={modalRoot} />
            </div>
        </div>
    )
}

export default SinglePlaylist