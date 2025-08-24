import DashboardMain from "../components/dashboard/DashboardMain.tsx"
import DashboardAside from "../components/dashboard/DashboardAside.tsx"

const Dashboard = () => {
    return (
        <div className="flex flex-nowrap space-x-14">
            <DashboardMain/>
            <DashboardAside />
        </div>
    )
}

export default Dashboard