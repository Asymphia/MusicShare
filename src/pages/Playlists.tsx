import SectionHeader from "../components/ui/SectionHeader.tsx"
import ExtendedEntityBlock from "../components/ui/ExtendedEntityBlock.tsx"
import albumCoverPlaceholder from "../assets/placeholders/album-cover-placeholder.png"
import { useAppDispatch, useAppSelector } from "../app/hooks.ts"
import { fetchPlaylists, selectPlaylists, selectPlaylistsStatus } from "../features/playlists/playlistsSlice.ts"
import { useCallback } from "react"
import Loader from "../components/ui/Loader.tsx"
import Error from "../components/ui/Error.tsx"

const Playlists = () => {
    const dispatch = useAppDispatch()

    const playlists = useAppSelector(selectPlaylists)
    const playlistsStatus = useAppSelector(selectPlaylistsStatus)

    const handleRetryPlaylists = useCallback(() => {
        dispatch(fetchPlaylists())
    }, [dispatch])

    return (
        <div className="md:space-y-14 space-y-8">
            <div>
                <SectionHeader title="Your playlists" as="h1"/>

                <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 lg:w-1/2 w-full">
                    All your playlists in one place &hearts;
                </p>
            </div>

            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {
                    playlistsStatus === "loading" && (
                        <div className="col-span-5 flex items-center justify-center">
                            <Loader size={96} stroke={5} />
                        </div>
                    )
                }

                {
                    playlistsStatus === "succeeded" && playlists.map(playlist => (
                        <ExtendedEntityBlock key={playlist.id} isTop={false}
                                             image={playlist.coverImageUrl || albumCoverPlaceholder} type="playlist"
                                             playlist={playlist.name} duration={0} creator={playlist.ownerName ?? "Unknown"}
                                             songAmount={playlist.songs ? playlist.songs.length : 0} id={playlist.id} />
                    ))
                }

                { playlistsStatus === "failed" && <Error text="playlists" handleRetry={ handleRetryPlaylists } mainClassName="!col-span-5" /> }
            </div>
        </div>
    )
}

export default Playlists