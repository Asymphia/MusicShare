import SectionHeader from "../ui/SectionHeader.tsx"
import Icon from "../ui/Icon.tsx"
import FeaturedButton from "../ui/FeaturedButton.tsx"
import type { ChangeEvent } from "react"

interface TitleDescFormProps {
    title: string
    onChangeTitle: (e: ChangeEvent<HTMLInputElement>) => void
    description: string
    onChangeDescription: (e: ChangeEvent<HTMLTextAreaElement>) => void
    onClick: () => void
}

const TitleDescForm = ({ title, onChangeTitle, description, onChangeDescription, onClick }: TitleDescFormProps) => {
    return (
        <div className="w-1/3 space-y-14 flex flex-col">
            <section>
                <div className="mb-6">
                    <SectionHeader title="Choose a perfect title" as="h4" className="!mb-2"/>

                    <p className="font-text text-xs text-primary-60 w-1/2">
                        Cook sth up I know u can do it~!
                    </p>
                </div>

                <label
                    className="group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80 w-full">
                    <Icon size={ 24 } name="search" className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80"/>

                    <input type="text" placeholder="Write title of your playlist..." value={ title } onChange={ onChangeTitle }
                           className="font-text text-xs text-primary-60 focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                    />
                </label>
            </section>

            <section>
                <div className="mb-6">
                    <SectionHeader title="Add description" as="h4" className="!mb-2"/>

                    <p className="font-text text-xs text-primary-60 w-1/2">
                        Unleash your mood!
                    </p>
                </div>

                <label
                    className="group flex flex-nowrap space-x-3 border border-solid border-primary-60 transition rounded-3xl hover:border-primary-80 w-full p-4 relative">
                    <Icon size={ 24 } name="search" className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80"/>

                    <textarea placeholder="Write description of your playlist..." maxLength={ 250 } value={ description } onChange={ onChangeDescription }
                           className="font-text text-xs text-primary-60 focus:outline-none w-full transition placehoder:transition h-[139px] resize-none
                            placeholder:text-primary-60 text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                    />

                    <p className="absolute bottom-4 right-4 font-text text-primary-60 text-xs">
                        { description.length }/250
                    </p>
                </label>
            </section>

            <FeaturedButton text="Next step" className="w-fit self-end" onClick={ onClick } />
        </div>
    )
}

export default TitleDescForm