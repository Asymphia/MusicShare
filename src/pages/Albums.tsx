import SectionHeader from "../components/ui/SectionHeader"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchAlbums, selectAlbums, selectAlbumsStatus } from "../features/albums/albumsSlice"
import { useCallback } from "react"
import Loader from "../components/ui/Loader"
import ExtendedEntityBlock from "../components/ui/ExtendedEntityBlock"
import placeholder from "../assets/placeholders/album-cover-placeholder.png"
import Error from "../components/ui/Error"

const Albums = () => {
    const dispatch = useAppDispatch()

    const albums = useAppSelector(selectAlbums)
    const albumsStatus = useAppSelector(selectAlbumsStatus)

    const handleRetryAlbums = useCallback(() => {
        dispatch(fetchAlbums())
    }, [dispatch])

    return (
        <div className="md:space-y-14 space-y-8">
            <div>
                <SectionHeader title="Albums" as="h1" />

                <p className="font-text xl:text-xs md:text-2xs text-3xs text-primary-60 lg:w-1/2 w-full">
                    Boost up your mood by listening to great albums &hearts;
                </p>
            </div>

            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {
                    albumsStatus === "loading" && (
                        <div className="col-span-5 flex items-center justify-center">
                            <Loader size={96} stroke={5} />
                        </div>
                    )
                }

                {
                    albumsStatus === "succeeded" && albums?.map(album => (
                        <ExtendedEntityBlock isTop={false} image={album.coverImageUrl || placeholder} type="album" album={album.name}
                            artist={album.artist?.name || "Unknown"} songAmount={0} duration={0} id={album.spotifyId}
                        />
                    ))
                }

                { albumsStatus === "failed" && <Error text="albums" handleRetry={ handleRetryAlbums } mainClassName="!col-span-5" /> }
            </div>
        </div>
    )
}

export default Albums