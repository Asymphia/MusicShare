import SectionHeader from "../components/ui/SectionHeader.tsx"
import TitleDescForm from "../components/create/TitleDescForm.tsx"
import { type ChangeEvent, useState } from "react"
import CoverForm from "../components/create/CoverForm.tsx"
import SongsForm from "../components/create/SongsForm.tsx"

const Create = () => {
    const [formState, setFormState] = useState<string>("title")
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [file, setFile] = useState<File | null>(null)
    const [fileUrl, setFileUrl] = useState<string>("")

    const titleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const descriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    const fileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null
        setFile(selected)
    }

    const urlChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFileUrl(e.target.value)
    }

    return (
        <div className="space-y-14">
            <div>
                <SectionHeader title="Create new playlist" as="h1"/>

                <p className="font-text text-xs text-primary-60 w-1/2">
                    Unleash your mood by some nice music &hearts;
                </p>
            </div>

            <form className="flex items-center justify-center flex-col">
                {
                    formState === "title" && <TitleDescForm title={ title } description={ description } onChangeDescription={ descriptionChange } onChangeTitle={ titleChange } onClick={ () => setFormState("photo") } />
                }

                {
                    formState === "photo" && <CoverForm file={ file } changeFile={ fileChange } fileUrl={ fileUrl } changeUrl={ urlChange } onClick={ () => setFormState("songs") } />
                }

                {
                    formState === "songs" && <SongsForm />
                }
            </form>
        </div>
    )
}

export default Create