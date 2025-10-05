import Popup, {type PopupHandle} from "./Popup"
import {type ChangeEvent, forwardRef, useImperativeHandle, useRef, useState, type DragEvent, useEffect} from "react"
import SectionHeader from "./SectionHeader"
import FeaturedButton from "./FeaturedButton"
import { useAppDispatch } from "../../app/hooks"
import { deleteSongFile, uploadSongFile } from "../../features/songs/songsSlice"
import Icon from "./Icon"

interface AddToPlaylistPopupProps {
    isOpen: boolean
    close: () => void
    songId: string
    songName: string
    hasFile: boolean
    portalContainer?: HTMLElement | null
}

export type AddToPlaylistPopupHandle = {
    close: () => void
}

const SongFilePopup = forwardRef<AddToPlaylistPopupHandle, AddToPlaylistPopupProps>(({ isOpen, close, songId, songName, hasFile, portalContainer = null }, ref) => {
    const popupRef = useRef<PopupHandle | null>(null)
    const dispatch = useAppDispatch()

    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [editing, setEditing] = useState(false)

    const inputRef = useRef<HTMLInputElement | null>(null)
    const [dragActive, setDragActive] = useState(false)

    useImperativeHandle(ref, () => ({
        close: () => close(),
    }))

    useEffect(() => {
        if(!isOpen) {
            setFile(null)
            setError(null)
            setUploading(false)
            setDeleting(false)
            setEditing(false)
            setDragActive(false)

            if (inputRef.current) {
                try {
                    inputRef.current.value = ""
                } catch { }
            }
        }
    }, [isOpen])

    const validateAndSetFile = (f: File | null) => {
        setError(null)

        if(!f) {
            setFile(null)
            return
        }

        const nameLow = f?.name.toLowerCase()
        const isMp3ByExt = nameLow?.endsWith(".mp3")
        const isAudio = f?.type.startsWith("audio/")

        if (!isAudio || !isMp3ByExt) {
            setError("Please select an MP3 audio file.")
            setFile(null)
            return
        }

        setFile(f)
    }

    const changeFile = (e: ChangeEvent<HTMLInputElement>) => {
        validateAndSetFile(e.target.files?.[0] ?? null)
    }

    const handleUpload = async () => {
        setError(null)

        if(!file) {
            setError("No file selected.")
            return
        }

        try {
            setUploading(true)
            await dispatch(uploadSongFile({ songId, file })).unwrap()

            close()
        } catch (err: any) {
            setError(err?.message ?? "Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleStartEdit = () => {
        setError(null)
        setEditing(true)
    }

    const handleCancelEdit = () => {
        setError(null)
        setEditing(false)
        setFile(null)
        if (inputRef.current) inputRef.current.value = ""
    }

    const handleDelete = async () => {
        try {
            setDeleting(true)
            await dispatch(deleteSongFile({ songId })).unwrap()
            close()
        } catch (err: any) {
            setError(err?.message ?? "Delete failed")
        } finally {
            setDeleting(false)
        }
    }

    const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    };

    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = "copy"
        setDragActive(true)
    };

    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const dt = e.dataTransfer
        if (!dt || !dt.files || dt.files.length === 0) return

        validateAndSetFile(dt.files[0])
    };

    const openFileDialog = (e?: MouseEvent) => {
        e?.preventDefault()
        inputRef.current?.click()
    };


    return (
        <Popup isOpen={isOpen} close={close} ref={popupRef} portalContainer={portalContainer} >
            <SectionHeader title="Menage what to do with this song" as="h4" />

            <div className="text-xs font-text text-primary-60 space-y-2">
                <p>
                    <span className="text-primary-80">
                        Song name:
                    </span>
                    &nbsp;{ songName }
                </p>

                <p>
                    <span className="text-primary-80">
                        Song Spotify's ID:
                    </span>
                    &nbsp;{ songId }
                </p>

                <p>
                    <span className="text-primary-80">
                        Has local file:
                    </span>
                    &nbsp;{ hasFile ? "Yes" : "No" }
                </p>
            </div>

            {
                editing ? (
                    <>
                        <label onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                               onDrop={handleDrop}
                               className={`cursor-pointer group flex flex-col items-center border border-primary-60 p-6 transition w-full rounded-2xl ${dragActive ? "border-dashed border-primary" : "border-solid hover:border-primary-80"} `}>

                            <input ref={inputRef} type="file" className="hidden" accept="audio/mpeg,audio/mp3,audio/*" onChange={changeFile}/>

                            <Icon size={32} name="upload" className="stroke-primary fill-none w-8 h-8 mb-6"/>

                            <p className="font-text text-xs text-primary mb-2">
                                Choose a file or drag & drop it here
                            </p>

                            <p className="font-text text-xs text-primary-60 mb-6">
                                MP3 formats only
                            </p>

                            <FeaturedButton text={!file ? "Upload a file" : "Change a file"} onClick={openFileDialog}/>

                        </label>

                        { error && <p className="font-text text-xs text-primary-60 mt-2">{ error }</p> }

                        <div className="mt-4 flex gap-3">
                            <FeaturedButton text="Cancel" onClick={ handleCancelEdit } className="w-full justify-center" />
                            <FeaturedButton
                                text={uploading ? "Uploading..." : "Upload"}
                                onClick={ handleUpload }
                                className="w-full justify-center"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {
                            !hasFile ? <FeaturedButton text="Add local file" className="!w-full justify-center" onClick={() => setEditing(true)} /> : (
                                <div className="flex flex-nowrap space-x-3">
                                    <FeaturedButton text="Edit file" className="!w-full justify-center" onClick={handleStartEdit} />
                                    <FeaturedButton text={ deleting ? "Deleting..." : "Delete a file" } className="!w-full justify-center" onClick={handleDelete} />
                                </div>
                            )
                        }

                        { error && <p className="font-text text-xs text-primary-60 mt-2">{ error }</p> }
                    </>
                )
            }
        </Popup>
    )
})

export default SongFilePopup