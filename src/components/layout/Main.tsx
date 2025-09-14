import {type PropsWithChildren, useLayoutEffect, useRef} from "react"
import {useLocation} from "react-router-dom";

const Main = ({ children }: PropsWithChildren) => {
    const ref = useRef<HTMLElement | null>(null)
    const { pathname } = useLocation()

    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return

        el.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }, [pathname])

    return (
        <main ref={ ref } className="bg-bg-secondary w-full rounded-l-4xl overflow-y-auto py-8 px-15 min-h-0">
            { children }
        </main>
    )
}

export default Main