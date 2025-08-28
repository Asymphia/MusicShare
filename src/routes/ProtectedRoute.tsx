import { useAppSelector } from "../app/hooks.ts"
import Loader from "../components/ui/Loader.tsx"
import { Navigate, Outlet } from "react-router-dom"

interface RedirectedRouteProps {
    redirectTo: string
    inverse?: boolean
}

const ProtectedRoute = ({ redirectTo, inverse = false }: RedirectedRouteProps) => {
    const { status } = useAppSelector(s => s.auth)

    if(status === "loading" || status === "idle") return <Loader />

    if(!inverse && status !== "authenticated") return <Navigate to={redirectTo} replace />
    if(inverse && status === "authenticated") return <Navigate to={redirectTo} replace />

    return <Outlet />
}

export default ProtectedRoute