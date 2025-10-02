import SectionHeader from "../components/ui/SectionHeader"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchAlbums, selectAlbums, selectAlbumsStatus } from "../features/albums/albumsSlice"
import { type ChangeEvent, useCallback, useMemo, useRef, useState } from "react"
import Loader from "../components/ui/Loader"
import ExtendedEntityBlock from "../components/ui/ExtendedEntityBlock"
import placeholder from "../assets/placeholders/album-cover-placeholder.png"
import Error from "../components/ui/Error"
import Icon from "../components/ui/Icon"
import useDebounce from "../hooks/useDebounce"

const Albums = () => {
    const dispatch = useAppDispatch()

    const albums = useAppSelector(selectAlbums)
    const albumsStatus = useAppSelector(selectAlbumsStatus)

    const handleRetryAlbums = useCallback(() => {
        dispatch(fetchAlbums())
    }, [dispatch])

    const [searchQuery, setSearchQuery] = useState<string>("")
    const debouncedSearchQuery = useDebounce(searchQuery, 150)

    const inputRef = useRef<HTMLInputElement>(null)

    const filteredAlbums = useMemo(() => {
        if(!albums || !Array.isArray(albums)) return []

        if(!debouncedSearchQuery.trim()) return albums

        const query = debouncedSearchQuery.toLowerCase()

        return albums.filter(album => {
            if(album.name.toLowerCase().includes(query)) return true
            if(album.artist?.name.toLowerCase().includes(query)) return true
            return false
        })
    }, [albums, debouncedSearchQuery])

    const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    const displayedAlbums = useMemo(() => {
        return filteredAlbums.slice(0, 50)
    }, [filteredAlbums])

    return (
        <div className="md:space-y-14 space-y-8">
            <div>
                <SectionHeader title="Albums" as="h1" />

                <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 lg:w-1/2 w-full">
                    Boost up your mood by listening to great albums &hearts;
                </p>
            </div>

            <label
                className="w-1/3 group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80">
                <Icon size={ 24 } name="search" className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80"/>

                <input ref={inputRef} type="text" placeholder="Search for a song, album or artist..." value={ searchQuery } onChange={ handleSearchChange }
                       className="font-text text-xs  focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                />
            </label>

            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {
                    albumsStatus === "succeeded" && filteredAlbums.length > 50 && (
                        <p className="font-text text-xs text-primary-60 col-span-5 mb-8">
                            Showing first 50 results of { filteredAlbums.length }. Refine your search for more specific results.
                        </p>
                    )
                }

                {
                    albumsStatus === "loading" && (
                        <div className="col-span-5 flex items-center justify-center">
                            <Loader size={96} stroke={5} />
                        </div>
                    )
                }

                {
                    albumsStatus === "succeeded" && displayedAlbums?.map(album => (
                        <ExtendedEntityBlock isTop={false} image={album.coverImageUrl || placeholder} type="album" album={album.name}
                            artist={album.artist?.name || "Unknown"} songAmount={0} duration={0} id={album.spotifyId}
                        />
                    ))
                }

                {
                    albumsStatus === "succeeded" && filteredAlbums.length === 0 && searchQuery.trim() && (
                        <p className="font-text text-xs text-primary-60 col-span-5">
                            No albums found for "{ searchQuery }".
                        </p>
                    )
                }

                { albumsStatus === "failed" && <Error text="albums" handleRetry={ handleRetryAlbums } mainClassName="!col-span-5" /> }
            </div>
        </div>
    )
}

export default Albums