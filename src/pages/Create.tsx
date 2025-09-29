import SectionHeader from "../components/ui/SectionHeader.tsx"
import TitleDescForm from "../components/create/TitleDescForm.tsx"
import {type ChangeEvent, useCallback, useState} from "react"
import CoverForm from "../components/create/CoverForm.tsx"
import SongsForm from "../components/create/SongsForm.tsx"
import {useAppDispatch, useAppSelector} from "../app/hooks"
import {fetchPlaylists, postPlaylist} from "../features/playlists/playlistsSlice"
import {selectUser} from "../features/user/userSlice"

const Create = () => {
    const [formState, setFormState] = useState<string>("title")
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [file, setFile] = useState<File | null>(null)
    const [addedSongs, setAddedSongs] = useState<string[]>([])
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)

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

    const handleAddSong = (spotifyId: string) => {
        if(addedSongs.includes(spotifyId)) {
            setAddedSongs(prevSongs => prevSongs.filter(id => id !== spotifyId))
        } else {
            setAddedSongs(prevSongs => [...prevSongs, spotifyId])
        }
    }

    const addPlaylist = useCallback(async () => {
        dispatch(postPlaylist({ name: title, ownerName: user?.name || "Unknown", description, coverPhoto: file }))
        dispatch(fetchPlaylists())
    }, [])

    return (
        <div className="space-y-14">
            <div>
                <SectionHeader title="Create new playlist" as="h1"/>

                <p className="font-text text-xs text-primary-60 w-1/2">
                    Unleash your mood by some nice music &hearts;
                </p>
            </div>

            <form className="flex flex-col">
                {
                    formState === "title" && <TitleDescForm title={ title } description={ description } onChangeDescription={ descriptionChange } onChangeTitle={ titleChange } onClick={ () => setFormState("photo") } />
                }

                {
                    formState === "photo" && <CoverForm file={ file } changeFile={ fileChange } onClickPrevious={ () => setFormState("title") } onClickNext={ () => setFormState("songs") } />
                }

                {
                    formState === "songs" && <SongsForm onClickNext={ addPlaylist } onClickPrevious={ () => setFormState("photo") } handleAddSong={ handleAddSong } addedSongs={ addedSongs } />
                }
            </form>
        </div>
    )
}

export default Create