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
        <main ref={ ref } className="bg-bg-secondary w-full xl:rounded-l-4xl rounded-b-4xl overflow-y-scroll py-8 xl:px-15 md:px-8 px-4 min-h-0">
            { children }
        </main>
    )
}

export default Main