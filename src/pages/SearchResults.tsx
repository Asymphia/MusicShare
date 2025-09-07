import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Loader from "../components/ui/Loader.tsx";
import bug from "../assets/icons/bug.svg";
import FeaturedButton from "../components/ui/FeaturedButton.tsx";
import SectionHeader from "../components/ui/SectionHeader.tsx";
import EntityBlock from "../components/ui/EntityBlock.tsx";
import ExtendedEntityBlock from "../components/ui/ExtendedEntityBlock.tsx";
import playlistPlaceholder from "../assets/placeholders/album-cover-placeholder.png"
import artistPlaceholder from "../assets/placeholders/artist-placeholder.png"
import songPlaceholder from "../assets/placeholders/song-placeholder.png"

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
}

export interface SearchSong {
    spotifyId: string
    title: string
    coverImageUrl: string | null
    songLengthInSeconds: number | null
    releaseDate: string | null
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

    const handleRetryPlaylist = () => {
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

    if(!results || (results.songs.length === 0 && results.artist.length === 0 && results.playlists.length === 0)) {
        return (
            <p className="font-text text-xs text-primary-60">
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

                        <div className="grid grid-cols-10 gap-4">
                            {
                                results?.songs.map(song => (
                                    <EntityBlock key={song.spotifyId}
                                                 image={song.coverImageUrl ? song.coverImageUrl : songPlaceholder}
                                                 type="song" song={song.title} artist="KORNEL" album=":|||" headerAs="h5"/>
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

                        <div className="grid grid-cols-10 gap-4">
                            {
                                results?.artist.map(artist => (
                                    <EntityBlock key={artist.spotifyId} type="artist"
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

                        <div className="grid grid-cols-5 gap-4">
                            {
                                results?.playlists.map(playlist => (
                                    <ExtendedEntityBlock
                                        image={playlist.coverImageUrl ? playlist.coverImageUrl : playlistPlaceholder}
                                        key={playlist.id} id={playlist.id} isTop={false} type="playlist"
                                        playlist={playlist.name}
                                        songAmount={0} duration={0} creators={["dzieki dziala"]}/>
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