import SectionHeader from "../ui/SectionHeader.tsx"
import Icon from "../ui/Icon.tsx"
import FeaturedButton from "../ui/FeaturedButton.tsx"
import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from "react"
import placeholder from "../../assets/placeholders/album-cover-placeholder.png"
import Overlay from "../ui/Overlay.tsx"

interface CoverFormProps {
    file: File | null
    changeFile: (e: ChangeEvent<HTMLInputElement>) => void
    fileUrl: string
    changeUrl: (e: ChangeEvent<HTMLInputElement>) => void
    onClickPrevious: () => void
    onClickNext: () => void
}

const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

const CoverForm = ({ file, changeFile, fileUrl, changeUrl, onClickPrevious, onClickNext }: CoverFormProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(() =>
        file ? URL.createObjectURL(file) : null
    )

    useEffect(() => {
        const prev = previewUrl
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        } else {
            setPreviewUrl(null)
        }
        return () => {
            if (prev) URL.revokeObjectURL(prev)
        }
    }, [file])

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

        const files = dt.files

        const fakeEvent = {
            target: {
                files,
            },
        } as unknown as ChangeEvent<HTMLInputElement>

        changeFile(fakeEvent)
    }

    const openFileDialog = (e?: MouseEvent) => {
        e?.preventDefault()
        inputRef.current?.click()
    };

    return (
        <section className="w-1/3 space-y-14 flex flex-col">
            <div className="mb-6">
                <SectionHeader title="Upload a cover" as="h4" className="!mb-2"/>

                <p className="font-text text-xs text-primary-60 w-1/2">
                    Select and upload cover image of your choice.
                </p>
            </div>

            <label onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                className={`cursor-pointer group flex flex-col items-center border border-primary-60 p-6 transition w-full rounded-2xl ${ dragActive ? "border-dashed border-primary" : "border-solid hover:border-primary-80" } `}>

                <input ref={inputRef} type="file" className="hidden" accept="image/png,image/jpeg" onChange={ changeFile } />

                <Icon size={ 32 } name="upload" className="stroke-primary fill-none w-8 h-8 mb-6"/>

                <p className="font-text text-xs text-primary mb-2">
                    Choose a file or drag & drop it here
                </p>

                <p className="font-text text-xs text-primary-60 mb-6">
                    JPEG and PNG formats up to 2 MB
                </p>

                <FeaturedButton text= { !file ? "Upload a file" : "Change a file" } onClick={openFileDialog} />
            </label>

            {
                file && (
                    <div className="flex gap-4 items-center">

                        <div className="w-20 h-20 relative p-[1px] bg-[linear-gradient(127deg,rgba(255,255,255,0.5)_1.98%,rgba(255,255,255,0)_38%,rgba(112,121,151,0)_58%,rgba(112,121,151,0.5)_100%)] rounded-2xl">
                            <img src={ previewUrl || placeholder } alt={ file.name }
                                 className="rounded-[9px] aspect-square w-full h-full object-cover"/>
                            <Overlay offset={1} radius={9}/>
                        </div>

                        <div className="font-text text-primary-60 text-xs space-y-2">
                            <p>
                                <span className="text-primary">Filename:</span><br/>
                                {file.name}
                            </p>
                            <p>
                                <span className="text-primary">Filesize:</span><br/>
                                {formatFileSize(file.size)}
                            </p>
                        </div>
                    </div>
                )
            }

            {
                !file && (
                    <>
                        <p className="font-text text-xs text-primary">
                            Or...
                        </p>

                        <label
                            className="group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80 w-full">
                            <Icon size={ 24 } name="search" className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80"/>

                            <input type="text" placeholder="Write an URL of a photo..." value={fileUrl}
                                   onChange={changeUrl}
                                   className="font-text text-xs text-primary-60 focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                            />
                        </label>
                    </>
                )
            }

            <div className="grid grid-cols-2 gap-4">
                <FeaturedButton text="Previous step" className="justify-center" onClick={ onClickPrevious }/>
                <FeaturedButton text="Next step" className="justify-center" onClick={ onClickNext }/>
            </div>
        </section>
    )
}

export default CoverForm