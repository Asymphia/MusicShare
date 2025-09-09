import SectionHeader from "../components/ui/SectionHeader.tsx";
import ExtendedEntityBlock from "../components/ui/ExtendedEntityBlock.tsx";
import albumCoverPlaceholder from "../assets/placeholders/album-cover-placeholder.png";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {fetchPlaylists, selectPlaylists, selectPlaylistsStatus} from "../features/playlists/playlistsSlice.ts";
import {useCallback} from "react";
import Loader from "../components/ui/Loader.tsx";
import bug from "../assets/icons/bug.svg";
import FeaturedButton from "../components/ui/FeaturedButton.tsx";

const Playlists = () => {
    const dispatch = useAppDispatch()

    const playlists = useAppSelector(selectPlaylists)
    const playlistsStatus = useAppSelector(selectPlaylistsStatus)

    const handleRetryPlaylists = useCallback(() => {
        dispatch(fetchPlaylists())
    }, [dispatch])

    return (
        <div className="space-y-14">
            <div>
                <SectionHeader title="Your playlists" as="h1"/>

                <p className="font-text text-xs text-primary-60 w-1/2">
                    All your playlists in one place &hearts;
                </p>
            </div>

            <div className="grid grid-cols-5 gap-4">
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
                                             image={playlist.coverImageUrl ?? albumCoverPlaceholder} type="playlist"
                                             playlist={playlist.name} duration={0} creator={playlist.ownerName ?? "Unknown"}
                                             songAmount={playlist.songs ? playlist.songs.length : 0} id={playlist.id} />
                    ))
                }

                {
                    playlistsStatus === "failed" && (
                        <div className="col-span-2 font-text text-primary-60 text-xs ">
                            <div className="flex flex-nowrap items-center gap-3 mb-3">
                                <img src={bug} className="w-6 " />
                                Failed to load playlists :(
                            </div>

                            <FeaturedButton text="Retry" className="!py-2" onClick={handleRetryPlaylists} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Playlists