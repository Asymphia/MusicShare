import SectionHeader from "../ui/SectionHeader.tsx"
import Icon from "../ui/Icon.tsx"
import FeaturedButton from "../ui/FeaturedButton.tsx"
import { fetchSongs, selectSongs, selectSongsStatus } from "../../features/songs/songsSlice.ts"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import ExtendedEntityBlock from "../ui/ExtendedEntityBlock.tsx"
import { type ChangeEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Error from "../ui/Error.tsx"
import Loader from "../ui/Loader.tsx"
import useDebounce from "../../hooks/useDebounce.ts"

interface SongItemProps {
    song: any
    onClickPlus: () => void
    isChecked: boolean
}

const SongItem = memo(({ song, onClickPlus, isChecked }: SongItemProps) => (
    <ExtendedEntityBlock key={song.spotifyId} isTop={false} image={song.coverImageUrl || ""} type="song" song={song.title} artist={song.artist} album={song.album} onClickPlus={onClickPlus} isChecked={isChecked} />
))

interface SongsFormProps {
    addedSongs: string[]
    handleAddSong: (spotifyId: string) => void
    onClickPrevious: () => void
    onClickNext: () => void
}

const SongsForm = ({ addedSongs, handleAddSong, onClickPrevious, onClickNext }: SongsFormProps) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchSongs())
    }, [dispatch])

    const songs = useAppSelector(selectSongs)
    const songsStatus = useAppSelector(selectSongsStatus)

    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearchQuery = useDebounce(searchQuery, 150)

    const inputRef = useRef<HTMLInputElement>(null)

    const filteredSongs = useMemo(() => {
        if(!songs || !Array.isArray(songs)) return []

        if(!debouncedSearchQuery.trim()) return songs

        const query = debouncedSearchQuery.toLowerCase()

        return songs.filter(song => {
            if (song.title?.toLowerCase().includes(query)) return true
            if (song.artist?.toLowerCase().includes(query)) return true
            if (song.album?.toLowerCase().includes(query)) return true
            return false
        })

    }, [songs, debouncedSearchQuery])

    const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    const handleRetry = useCallback(() => {
        dispatch(fetchSongs())
    }, [dispatch])

    const displayedSongs = useMemo(() => {
        return filteredSongs.slice(0, 50)
    }, [filteredSongs])

    return (
        <section className="w-full space-y-12 flex flex-col">
            <div className="w-1/3">
                <SectionHeader title="Add your favourite songs" as="h4" className="!mb-2"/>

                <p className="font-text text-xs text-primary-60 w-1/2">
                    Choose the best ones.
                </p>
            </div>

            <label
                className="w-1/3 group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80">
                <Icon size={ 24 } name="search" className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80"/>

                <input ref={inputRef} type="text" placeholder="Search for a song, album or artist..." value={ searchQuery } onChange={ handleSearchChange }
                       className="font-text text-xs text-primary-60 focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                />
            </label>

            <div className="grid grid-cols-5 gap-4">
                {
                    songsStatus === "succeeded" && filteredSongs.length > 50 && (
                        <p className="font-text text-xs text-primary-60 col-span-5 mb-8">
                            Showing first 50 results of { filteredSongs.length }. Refine your search for more specific results.
                        </p>
                    )
                }

                {
                    songsStatus === "succeeded" && displayedSongs.map(song => (
                        <SongItem key={song.spotifyId} song={song} isChecked={ addedSongs.includes(song.spotifyId) } onClickPlus={ () => handleAddSong(song.spotifyId) } />
                    ))
                }

                {
                    songsStatus === "failed" && (
                        <Error text="songs" handleRetry={ handleRetry } mainClassName="col-span-5" />
                    )
                }

                {
                    songsStatus === "loading" && (
                        <div className="justify-self-center col-span-5">
                            <Loader size={64} />
                        </div>
                    )
                }

                {
                    songsStatus === "succeeded" && filteredSongs?.length === 0 && searchQuery.trim() && (
                        <p className="font-text text-xs text-primary-60 col-span-5">
                            No songs found for "{ searchQuery }".
                        </p>
                    )
                }
            </div>

            <div className="grid grid-cols-2 gap-6 w-1/3">
                <FeaturedButton text="Previous step" className="justify-center" onClick={ onClickPrevious }/>
                <FeaturedButton text="Create playlist" className="justify-center" onClick={ onClickNext }/>
            </div>
        </section>
    )
}

export default SongsForm