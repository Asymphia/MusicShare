import SectionHeader from "../components/ui/SectionHeader.tsx"
import ExtendedEntityBlock from "../components/ui/ExtendedEntityBlock.tsx"
import albumCoverPlaceholder from "../assets/placeholders/album-cover-placeholder.png"
import { useAppDispatch, useAppSelector } from "../app/hooks.ts"
import { fetchPlaylists, selectPlaylists, selectPlaylistsStatus } from "../features/playlists/playlistsSlice.ts"
import {useCallback, useRef} from "react"
import Loader from "../components/ui/Loader.tsx"
import Error from "../components/ui/Error.tsx"
import Icon from "../components/ui/Icon"
import useDynamicSearch from "../hooks/useDynamicSearch"

const Playlists = () => {
    const dispatch = useAppDispatch()

    const playlists = useAppSelector(selectPlaylists)
    const playlistsStatus = useAppSelector(selectPlaylistsStatus)

    const handleRetryPlaylists = useCallback(() => {
        dispatch(fetchPlaylists())
    }, [dispatch])

    const { searchQuery, handleSearchChange, filteredData: filteredPlaylists, displayedData: displayedPlaylists } = useDynamicSearch(
        playlists,
        useCallback((p, q) => p.name?.toLowerCase().includes(q) || p.ownerName?.toLowerCase().includes(q) as boolean, []),
        { debounceMs: 150, displayLimit: 50 }
    )

    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="md:space-y-14 space-y-8">
            <div>
                <SectionHeader title="Your playlists" as="h1"/>

                <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 lg:w-1/2 w-full">
                    All your playlists in one place &hearts;
                </p>
            </div>

            <label
                className="w-1/3 group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80">
                <Icon size={ 24 } name="search" className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80"/>

                <input ref={ inputRef } type="text" placeholder="Search for a playlist..." value={ searchQuery } onChange={ handleSearchChange }
                       className="font-text text-xs  focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                />
            </label>

            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {
                    playlistsStatus === "succeeded" && filteredPlaylists.length > 50 && (
                        <p className="font-text text-xs text-primary-60 2xl:col-span-5 xl:col-span-4 lg:col-span-3 sm:col-span-2 mb-8">
                            Showing first 50 results of { filteredPlaylists.length }. Refine your search for more specific results.
                        </p>
                    )
                }

                {
                    playlistsStatus === "loading" && (
                        <div className="2xl:col-span-5 xl:col-span-4 lg:col-span-3 sm:col-span-2 flex items-center justify-center">
                            <Loader size={96} stroke={5} />
                        </div>
                    )
                }

                {
                    playlistsStatus === "succeeded" && displayedPlaylists.map(playlist => (
                        <ExtendedEntityBlock key={playlist.id} isTop={false}
                                             image={playlist.coverImageUrl || albumCoverPlaceholder} type="playlist"
                                             playlist={playlist.name} duration={0} creator={playlist.ownerName ?? "Unknown"}
                                             songAmount={playlist.songs ? playlist.songs.length : 0} id={playlist.id} />
                    ))
                }

                {
                    playlistsStatus === "succeeded" && filteredPlaylists?.length === 0 && searchQuery.trim() && (
                        <div className="font-text text-xs text-primary-60 2xl:col-span-5 xl:col-span-4 lg:col-span-3 sm:col-span-2">
                            No playlists found for "{ searchQuery }"
                        </div>
                    )
                }

                { playlistsStatus === "failed" && <Error text="playlists" handleRetry={ handleRetryPlaylists } mainClassName="!col-span-5" /> }
            </div>
        </div>
    )
}

export default Playlists