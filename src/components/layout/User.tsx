import userPfpPlaceholder from "../../assets/placeholders/user-pfp-placeholder.png"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import { fetchUser, selectUser, selectUserStatus } from "../../features/user/userSlice.ts"
import Loader from "../ui/Loader.tsx"
import { useCallback } from "react"
import Error from "../ui/Error.tsx"

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
        return <Error text="user" handleRetry={ handleRetry } buttonClassName="!w-full !py-2" />
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