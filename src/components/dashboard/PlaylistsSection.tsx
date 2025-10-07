import SectionHeader from "../ui/SectionHeader.tsx"
import SeeAllButton from "../ui/SeeAllButton.tsx"
import Loader from "../ui/Loader.tsx"
import ExtendedEntityBlock from "../ui/ExtendedEntityBlock.tsx"
import albumCoverPlaceholder from "../../assets/placeholders/album-cover-placeholder.png"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import { fetchPlaylists, selectPlaylists, selectPlaylistsStatus } from "../../features/playlists/playlistsSlice.ts"
import { useCallback } from "react"
import Error from "../ui/Error.tsx"
import useWindowWidth from "../../hooks/useWindowWidth.ts"

const PlaylistsSection = () => {
    const dispatch = useAppDispatch()

    const playlists = useAppSelector(selectPlaylists)
    const playlistsStatus = useAppSelector(selectPlaylistsStatus)

    const handleRetryPlaylists = useCallback(() => {
        dispatch(fetchPlaylists())
    }, [dispatch])

    const width = useWindowWidth()

    return (
        <section>
            <SectionHeader title="Come back to us" as="h3" right={<SeeAllButton link="/playlists"/>}/>

            <div className="grid xl:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 grid-cols-1 space-x-3">
                {
                    playlistsStatus === "loading" && (
                        <div className="col-span-2 flex items-center justify-center">
                            <Loader size={48} stroke={4}/>
                        </div>
                    )
                }

                {
                    playlistsStatus === "succeeded" && playlists.slice(0, width >= 1280 ? 6 : width >= 1024 ? 2 : 6).map(playlist => (
                        <ExtendedEntityBlock id={playlist.id} key={playlist.id} isTop={false}
                                             image={playlist.coverImageUrl ?? albumCoverPlaceholder} type="playlist"
                                             playlist={playlist.name} duration={0} creator={playlist.ownerName ?? "Unknown"}
                                             songAmount={playlist.songs ? playlist.songs.length : 0}/>
                    ))
                }

                { playlistsStatus === "failed" && <Error text="playlists" handleRetry={ handleRetryPlaylists } buttonClassName="!py-2" mainClassName="!col-span-2" /> }
            </div>
        </section>
    )
}

export default PlaylistsSection