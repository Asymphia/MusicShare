import TopStats from "./TopStats.tsx"
import RecentlyPlayed from "./RecentlyPlayed.tsx"
import PlaylistsSection from "./PlaylistsSection.tsx"

const DashboardAside = () => {
    return (
        <div className="space-y-14">
            <TopStats />
            <RecentlyPlayed />
            <PlaylistsSection />
        </div>
    )
}

export default DashboardAside