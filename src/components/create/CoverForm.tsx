import SectionHeader from "../ui/SectionHeader.tsx"
import Icon from "../ui/Icon.tsx"
import FeaturedButton from "../ui/FeaturedButton.tsx"
import type {ChangeEvent} from "react";

interface CoverFormProps {
    file: File | null
    changeFile: (e: ChangeEvent<HTMLInputElement>) => void
    fileUrl: string
    changeUrl: (e: ChangeEvent<HTMLInputElement>) => void
    onClick: () => void
}

const CoverForm = ({ file, changeFile, fileUrl, changeUrl, onClick }: CoverFormProps) => {
    return (
        <section className="w-1/3 space-y-14 flex flex-col">
            <div className="mb-6">
                <SectionHeader title="Upload a cover" as="h4" className="!mb-2"/>

                <p className="font-text text-xs text-primary-60 w-1/2">
                    Select and upload cover image of your choice.
                </p>
            </div>

            <label
                className="cursor-pointer group flex flex-col items-center border border-solid border-primary-60 p-6 transition hover:border-primary-80 w-full rounded-2xl">
                <input type="file" className="hidden" accept="image/png,image/jpeg" onChange={ changeFile } />

                <Icon name="upload" className="stroke-primary fill-none w-8 h-8 mb-6"/>

                <p className="font-text text-xs text-primary mb-2">
                    Choose a file or drag & drop it here
                </p>

                <p className="font-text text-xs text-primary-60 mb-6">
                    JPEG and PNG formats up to 2 MB
                </p>

                <FeaturedButton text="Upload a file"/>
            </label>

            {
                !file && (
                    <>
                        <p className="font-text text-xs text-primary">
                            Or...
                        </p>

                        <label
                            className="group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80 w-full">
                            <Icon name="search" className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80"/>

                            <input type="text" placeholder="Write title of your playlist..." value={fileUrl}
                                   onChange={changeUrl}
                                   className="font-text text-xs text-primary-60 focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                            />
                        </label>
                    </>
                )
            }

            <FeaturedButton text="Next step" className="w-fit self-end" onClick={onClick}/>
        </section>
    )
}

export default CoverForm