import type { PropsWithChildren } from "react"

const Main = ({ children }: PropsWithChildren) => {
    return (
        <main className="bg-bg-secondary w-full rounded-l-4xl overflow-y-auto py-8 px-15">
            { children }
        </main>
    )
}

export default Main