import DashboardMain from "../components/dashboard/DashboardMain.tsx"
import DashboardAside from "../components/dashboard/DashboardAside.tsx"

const Dashboard = () => {
    return (
        <div className="grid xl:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-14">
            <DashboardMain/>
            <DashboardAside />
        </div>
    )
}

export default Dashboard