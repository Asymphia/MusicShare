import Icon from "./Icon.tsx"
import { type FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import useWindowWidth from "../../hooks/useWindowWidth.ts"

const SearchBar = () => {
    const [term, setTerm] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if(!term.trim()) return

        const formatted = encodeURIComponent(term.trim())
        setTerm("")

        navigate(`/search/${formatted}`)
    }

    const width = useWindowWidth()

    return (
        <form className="xl:w-130 w-full mb-15" onSubmit={handleSubmit}>
            <label className="group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80 w-full">
                <Icon size={ width >= 1280 ? 24 : 16 } name="search" className="xl:w-6 xl:h-6 w-4 h-4 fill-primary-60 transition group-hover:fill-primary-80" />

                <input
                    type="text"
                    placeholder="Search..."
                    name="search"
                    value={ term }
                    onChange={ e => setTerm(e.target.value) }
                    className="font-text xl:text-xs text-2xs text-primary-60 focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                />
            </label>
        </form>
    )
}

export default SearchBar