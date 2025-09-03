import userPfpPlaceholder from "../../assets/placeholders/user-pfp-placeholder.png"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import { fetchUser, selectUser, selectUserStatus } from "../../features/user/userSlice.ts"
import Loader from "../ui/Loader.tsx"
import bug from "../../assets/icons/bug.svg"
import FeaturedButton from "../ui/FeaturedButton.tsx";
import { useCallback } from "react"

const User = () => {
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)
    const status = useAppSelector(selectUserStatus)

    const handleRetry = useCallback(() => {
        dispatch(fetchUser())
    }, [dispatch])

    if(status === "loading") {
        return (
            <Loader size={48} stroke={3} />
        )
    }

    if(status === "failed") {
        return (
            <div className="font-text text-primary-60 text-xs">
                <div className="flex flex-nowrap items-center gap-3 mb-3">
                    <img src={bug} className="w-6" alt="Error" />
                    Failed to load user :(
                </div>

                <FeaturedButton text="Retry" className="!py-2 !w-full" onClick={handleRetry} />
            </div>
        )
    }

    const imgSrc = user?.imageUrl ?? userPfpPlaceholder
    const displayName = user?.name ?? "Unknown user"

    return (
        <div className="space-y-2">
            <img src={imgSrc} alt={`${displayName} profile picture`} className="w-17 h-17 rounded-full"/>
            <p className="font-text text-primary text-s">
                <span className="text-accent-2">Logged as:</span> <br />
                { displayName }
            </p>
        </div>
    )
}

export default User