import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Loader from "../components/ui/Loader.tsx"
import SectionHeader from "../components/ui/SectionHeader.tsx"
import EntityBlock from "../components/ui/EntityBlock.tsx"
import ExtendedEntityBlock from "../components/ui/ExtendedEntityBlock.tsx"
import playlistPlaceholder from "../assets/placeholders/album-cover-placeholder.png"
import artistPlaceholder from "../assets/placeholders/artist-placeholder.png"
import songPlaceholder from "../assets/placeholders/song-placeholder.png"
import ErrorComponent from "../components/ui/Error.tsx"

export interface SearchArtist {
    spotifyId: string
    name: string
    imageUrl: string | null
}

export interface SearchPlaylist {
    id: number
    spotifyId: string
    name: string
    coverImageUrl: string | null
    ownerName?: string
}

interface SearchAlbum {
    spotifyId: string
    name: string
    coverImageUrl: string | null
    artist: string | null
}

export interface SearchSong {
    spotifyId: string
    title: string
    coverImageUrl: string | null
    songLengthInSeconds: number | null
    releaseDate: string | null
    artist: string
    album: SearchAlbum
}

export interface SearchResponse {
    artist: SearchArtist[]
    playlists: SearchPlaylist[]
    songs: SearchSong[]
}

const API_BASE = import.meta.env.VITE_API_BASE

const SearchResults = () => {
    const { query } = useParams<{ query: string }>()
    const [results, setResults] = useState<SearchResponse | null>(null)
    const [status, setStatus] = useState<"idle" | "loading" | "failed" | "success">("idle")

    useEffect(() => {
        if(!query) return

        const fetchResults = async () => {
            setStatus("loading")

            try {
                const res = await fetch(
                    `${API_BASE}/api/SearchBar?name=${encodeURIComponent(query)}&take=20`
                )

                if(!res.ok) throw new Error(`Failed: ${res.status}`)
                const data = await res.json()

                setResults(data)
                setStatus("success")
            } catch (err) {
                setStatus("failed")
            }
        }

        fetchResults()
    }, [query])

    const handleRetry = () => {
        window.location.reload()
    }

    if(status === "loading" || status === "idle") {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Loader size={96} stroke={5} />
            </div>
        )
    }

    if(status === "failed") {
        return <ErrorComponent text="search results" handleRetry={ handleRetry } buttonClassName="!py-2" />
    }

    if(!results || (results.songs.length === 0 && results.artist.length === 0 && results.playlists.length === 0)) {
        return (
            <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60">
                There is no results for your query :(
            </p>
        )
    }

    return (
        <div className="space-y-14">
            <SectionHeader title={`Search results for "${query}"`} as="h1" className="mb-14" />

            {
                results?.songs.length > 0 && (
                    <section>
                        <SectionHeader title="Songs" as="h2"/>

                        <div className="grid 2xl:grid-cols-10 xl:grid-cols-9 lg:grid-cols-8 md:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-1">
                            {
                                results?.songs.map(song => (
                                    <EntityBlock key={`SearchResultSong${song.spotifyId}`}
                                                 image={song.coverImageUrl ? song.coverImageUrl : songPlaceholder}
                                                 type="song" song={song.title} artist={ song.artist } album={ song.album.name } headerAs="h5"/>
                                ))
                            }
                        </div>
                    </section>
                )
            }

            {
                results?.artist.length > 0 && (
                    <section>
                        <SectionHeader title="Artists" as="h2"/>

                        <div className="grid 2xl:grid-cols-10 xl:grid-cols-9 lg:grid-cols-8 md:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-1">
                            {
                                results?.artist.map(artist => (
                                    <EntityBlock key={`SearchResultArtist${artist.spotifyId}`} type="artist"
                                                 image={artist.imageUrl ? artist.imageUrl : artistPlaceholder}
                                                 artist={artist.name} headerAs="h5"/>
                                ))
                            }
                        </div>
                    </section>
                )
            }

            {
                results?.playlists.length > 0 && (
                    <section>
                        <SectionHeader title="Playlists" as="h2"/>

                        <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-1">
                            {
                                results?.playlists.map(playlist => (
                                    <ExtendedEntityBlock
                                        image={playlist.coverImageUrl ? playlist.coverImageUrl : playlistPlaceholder}
                                        key={`SearchResultPlaylist${playlist.id}`} id={playlist.id} isTop={false} type="playlist"
                                        playlist={playlist.name}
                                        songAmount={0} duration={0} creator={playlist.ownerName}/>
                                ))
                            }
                        </div>
                    </section>
                )
            }

        </div>
    )
}

export default SearchResults