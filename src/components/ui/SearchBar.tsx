import Icon from "./Icon.tsx"
import { type FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

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

    return (
        <form className="w-130 mb-15" onSubmit={handleSubmit}>
            <label className="group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80 w-full">
                <Icon name="search" className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80" />

                <input
                    type="text"
                    placeholder="Search..."
                    name="search"
                    value={ term }
                    onChange={ e => setTerm(e.target.value) }
                    className="font-text text-xs text-primary-60 focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                />
            </label>
        </form>
    )
}

export default SearchBar