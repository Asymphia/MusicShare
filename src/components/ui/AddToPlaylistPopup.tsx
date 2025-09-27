import SectionHeader from "./SectionHeader.tsx"
import Icon from "./Icon.tsx"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import { fetchPlaylists, selectPlaylists, selectPlaylistsStatus } from "../../features/playlists/playlistsSlice.ts"
import ExtendedEntityBlock from "./ExtendedEntityBlock.tsx"
import placeholder from "../../assets/placeholders/album-cover-placeholder.png"
import MorphIcon from "./MorphIcon.tsx"
import { type ChangeEvent, useCallback, useMemo, useRef, useState } from "react"
import useDebounce from "../../hooks/useDebounce.ts"
import Error from "./Error.tsx"
import Loader from "./Loader.tsx"

const AddToPlaylistPopup = () => {
    const dispatch = useAppDispatch()

    const playlists = useAppSelector(selectPlaylists)
    const playlistsStatus = useAppSelector(selectPlaylistsStatus)

    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearchQuery = useDebounce(searchQuery, 150)

    const inputRef = useRef<HTMLInputElement>(null)

    const filteredPlaylists = useMemo(() => {
        if(!playlists || !Array.isArray(playlists)) return []

        if(!debouncedSearchQuery.trim()) return playlists

        const query = debouncedSearchQuery.toLowerCase()

        return playlists.filter(playlist => {
            if (playlist.name?.toLowerCase().includes(query)) return true
            if (playlist.ownerName?.toLowerCase().includes(query)) return true
            return false
        })

    }, [playlists, debouncedSearchQuery])

    const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    const displayedPlaylists = useMemo(() => {
        return filteredPlaylists.slice(0, 4)
    }, [filteredPlaylists])

    const handleRetryPlaylists = useCallback(() => {
        dispatch(fetchPlaylists())
    }, [dispatch])


    return (
        <dialog className="bg-bg-primary p-8 rounded-3xl absolute top-[30px] z-20 space-y-6 w-[460px]" open={true}>
            <SectionHeader title="Add to playlist" as="h4"/>

            <label
                className="group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80 w-full">
                <Icon size={24} name="search"
                      className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80"/>

                <input type="text" placeholder="Search for a playlist..." ref={inputRef} value={ searchQuery } onChange={ handleSearchChange }
                       className="font-text text-xs text-primary-60 focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                />
            </label>

            <div className="space-y-3 w-full">
                {
                    playlistsStatus === "succeeded" && displayedPlaylists.map(playlist => (
                        <div key={playlist.id} className="flex flex-nowrap justify-between w-full overflow-hidden gap-4">
                            <div className="min-w-0 flex-1 overflow-hidden">
                                <ExtendedEntityBlock isTop={false} image={playlist.coverImageUrl || placeholder}
                                                     type="playlist" playlist={playlist.name}
                                                     creator={playlist.ownerName || "unknown"} id={playlist.id}
                                                     songAmount={playlist.songs?.length || 0} duration={0}/>
                            </div>
                            <button type="button" className="flex-shrink-0 h-fit mt-2">
                                <MorphIcon isChecked={false} className="cursor-pointer fill-primary-60 hover:fill-primary-80 active:fill-primary"/>
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
                    playlistsStatus === "succeeded" && displayedPlaylists.length === 0 && (
                        <p className="font-text text-xs text-primary-60">
                            No playlist found. :(
                        </p>
                    )
                }
            </div>
        </dialog>
    )
}

export default AddToPlaylistPopup