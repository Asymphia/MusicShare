import DashboardMain from "../components/dashboard/DashboardMain.tsx"
import DashboardAside from "../components/dashboard/DashboardAside.tsx"

const Dashboard = () => {
    return (
        <div className="grid grid-cols-2 gap-14">
            <DashboardMain/>
            <DashboardAside />
        </div>
    )
}

export default Dashboard