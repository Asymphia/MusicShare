import SectionHeader from "../ui/SectionHeader.tsx"
import Loader from "../ui/Loader.tsx"
import RecentlyPlayedItem from "./RecentlyPlayedItem.tsx"
import photo from "../../assets/placeholders/placeholder-image.jpg"
import { useCallback } from "react"
import {
    fetchListeningHistory,
    selectListeningHistoryItems, selectListeningHistoryStatus
} from "../../features/listeningHistory/listeningHistorySlice.ts"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import Error from "../ui/Error.tsx"

const RecentlyPlayed = () => {
    const dispatch = useAppDispatch()

    const historyItems = useAppSelector(selectListeningHistoryItems)
    const historyStatus = useAppSelector(selectListeningHistoryStatus)

    const handleRetryHistory = useCallback(() => {
        dispatch(fetchListeningHistory(4))
    }, [dispatch])

    return (
        <section>
            <SectionHeader title="Recently played" as="h3"/>

            <div className="space-y-3">

                {
                    historyStatus === "loading" && (
                        <div className="col-span-2 flex items-center justify-center">
                            <Loader size={48} stroke={4}/>
                        </div>
                    )
                }

                { historyStatus === "failed" && <Error text="history" handleRetry={ handleRetryHistory } buttonClassName="!py-2" /> }

                {
                    historyStatus === "succeeded" && historyItems.length === 0 && (
                        <div className="font-text text-primary-60 text-xs">
                            No recently played tracks.
                        </div>
                    )
                }

                {
                    historyStatus === "succeeded" && historyItems.map(item => (
                        <RecentlyPlayedItem key={item.id} title={item.songShort?.title ?? "Unknown"}
                                            playlistId={item.playlistShort?.id ?? null}
                                            playlist={item.playlistShort?.name ?? "—"}
                                            genre={item.genreShortModelDTO?.map(g => g.name).join(", ") || "unknown"}
                                            cover={item.songShort?.coverImageUrl ?? photo}
                                            length={item.songShort?.songLengthInSeconds ? `${Math.floor((item.songShort.songLengthInSeconds ?? 0) / 60)}:${String((item.songShort.songLengthInSeconds ?? 0) % 60).padStart(2, "0")}` : ""}/>
                    ))
                }
            </div>
        </section>
    )
}

export default RecentlyPlayed