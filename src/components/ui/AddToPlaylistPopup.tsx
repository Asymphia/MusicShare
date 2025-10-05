import SectionHeader from "./SectionHeader.tsx"
import Icon from "./Icon.tsx"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import { fetchPlaylists, postSongToPlaylist, selectPlaylists, selectPlaylistsStatus } from "../../features/playlists/playlistsSlice.ts"
import ExtendedEntityBlock from "./ExtendedEntityBlock.tsx"
import placeholder from "../../assets/placeholders/album-cover-placeholder.png"
import MorphIcon from "./MorphIcon.tsx"
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react"
import Error from "./Error.tsx"
import Loader from "./Loader.tsx"
import FeaturedButton from "./FeaturedButton"
import useDynamicSearch from "../../hooks/useDynamicSearch"
import Popup, { type PopupHandle } from "./Popup"

interface AddToPlaylistPopupProps {
    isOpen: boolean
    close: () => void
    songId: string
    portalContainer?: HTMLElement | null
}

export type AddToPlaylistPopupHandle = {
    close: () => void
}

const AddToPlaylistPopup = forwardRef<AddToPlaylistPopupHandle, AddToPlaylistPopupProps>(({ isOpen, close, songId, portalContainer = null }, ref) => {
    const dispatch = useAppDispatch()
    const playlists = useAppSelector(selectPlaylists)
    const playlistsStatus = useAppSelector(selectPlaylistsStatus)

    const [playlistsId, setPlaylistsId] = useState<number[]>([])
    const [error, setError] = useState<string | null>(null)

    const popupRef = useRef<PopupHandle | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const { searchQuery, handleSearchChange, filteredData: filteredPlaylists, displayedData: displayedPlaylists } = useDynamicSearch(
        playlists,
        useCallback((p, q) => p.name?.toLowerCase().includes(q) || p.ownerName?.toLowerCase().includes(q) as boolean, []),
        { debounceMs: 150, displayLimit: 4 }
    )

    useImperativeHandle(ref, () => ({
        close: () => popupRef.current?.close()
    }), [close])

    const togglePlaylistId = useCallback((id: number) => {
        setPlaylistsId(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id])
    }, [])

    const handleAddToPlaylist = useCallback(async () => {
        setError(null)

        if(playlistsId.length === 0) {
            close()
            return
        }

        try {
            await Promise.all(playlistsId.map(playlistId => {
                dispatch(postSongToPlaylist({ playlistId, songId })).unwrap()
            }))

            close()
            setPlaylistsId([])
        } catch (err) {
            setError("Failed to add song to playlist.")
        }
    }, [dispatch, playlistsId, songId, close])

    const handleRetryPlaylists = useCallback(() => {
        dispatch(fetchPlaylists())
    }, [dispatch])

    return (
        <Popup ref={popupRef} isOpen={isOpen} close={close} portalContainer={portalContainer} >
            <SectionHeader title="Add to playlist" as="h4" />

            <label className="group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80 w-full">
                <Icon size={24}
                      name="search"
                      className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80"
                />

                <input type="text" placeholder="Search for a playlist..." ref={ inputRef } value={ searchQuery } onChange={ handleSearchChange }
                       className="font-text text-xs text-primary-60 focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                />
            </label>

            <div className="space-y-3 w-full">
                {
                    playlistsStatus === "succeeded" && filteredPlaylists.length > 50 && (
                        <p className="font-text text-xs text-primary-60 mb-8">
                            Showing first 4 results of { filteredPlaylists.length }. Refine your search for more specific results.
                        </p>
                    )
                }

                {
                    playlistsStatus === "succeeded" && displayedPlaylists.map(playlist => (
                        <div key={playlist.id} className="flex flex-nowrap justify-between w-full overflow-hidden gap-4">
                            <div className="min-w-0 flex-1 overflow-hidden">
                                <ExtendedEntityBlock isTop={false} image={playlist.coverImageUrl || placeholder}
                                                     type="playlist" playlist={playlist.name}
                                                     creator={playlist.ownerName || "unknown"} id={playlist.id}
                                                     songAmount={playlist.songs?.length || 0} duration={0}/>
                            </div>
                            <button type="button" className="flex-shrink-0 h-fit mt-2" onClick={() => togglePlaylistId(playlist.id)} aria-pressed={playlistsId.includes(playlist.id)}>
                                <MorphIcon isChecked={playlistsId.includes(playlist.id)} className="cursor-pointer fill-primary-60 hover:fill-primary-80 active:fill-primary"/>
                            </button>
                        </div>
                    ))
                }

                {
                    playlistsStatus === "failed" && (
                        <Error text="playlists" handleRetry={handleRetryPlaylists} />
                    )
                }

                {
                    playlistsStatus === "loading" && (
                        <Loader size={48} stroke={3} />
                    )
                }

                {
                    playlistsStatus === "succeeded" && filteredPlaylists.length === 0 && (
                        <p className="font-text text-xs text-primary-60">
                            No playlist found. :(
                        </p>
                    )
                }

                {
                    error && (
                        <p className="font-text text-xs text-primary-60">{ error }</p>
                    )
                }
            </div>

            <div className="grid grid-cols-2 gap-3">
                <FeaturedButton text="Cancel" onClick={() => close()} className="w-full justify-center" />
                <FeaturedButton text="Add" onClick={() => handleAddToPlaylist()} className="w-full justify-center" />
            </div>
        </Popup>
    )
})

export default AddToPlaylistPopup