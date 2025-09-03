import placeholder from "../../assets/placeholders/placeholder-image.jpg"
import { useAppSelector } from "../../app/hooks.ts"
import { selectUser, selectUserError, selectUserStatus } from "../../features/user/userSlice.ts"
import Loader from "../ui/Loader.tsx"
import bug from "../../assets/icons/bug.svg"

const User = () => {
    const user = useAppSelector(selectUser)
    const status = useAppSelector(selectUserStatus)
    const error = useAppSelector(selectUserError)

    if(status === "loading") {
        return (
            <Loader size={48} stroke={3} />
        )
    }

    if(status === "failed") {
        return (
            <div className="col-span-2 font-text text-primary-60 text-xs flex flex-nowrap items-center gap-3">
                <img src={bug} className="w-6 "/>
                Failed to load user :(
            </div>
        )
    }

    const imgSrc = user?.imageUrl ?? placeholder
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