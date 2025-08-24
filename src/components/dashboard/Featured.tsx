import bgImage from "../../assets/placeholders/placeholder-image.jpg"
import Icon from "../ui/Icon.tsx"
import TextWithIcon from "../ui/TextWithIcon.tsx"
import FeaturedButton from "../ui/FeaturedButton.tsx"

const Featured = () => {
    return (
        <div className="relative w-full h-[429px] p-[3px] bg-[linear-gradient(127deg,rgba(255,255,255,0.5)_1.98%,rgba(255,255,255,0)_38%,rgba(112,121,151,0)_58%,rgba(112,121,151,0.5)_100%)] rounded-4xl">
            <img src={bgImage} className="h-[423px] w-[423px] absolute top-[3px] right-[3px] object-cover mask-gradient rounded-[37px]"/>

            <div
                className="w-full h-full rounded-[37px] bg-[linear-gradient(127deg,#545454_0%,#313131_60%)] py-8 px-10 flex flex-col justify-between items-start">
                <p className="font-text text-l text-primary-60 flex flex-nowrap items-center gap-3">
                    Selected especially for you
                    <Icon name="star" className="w-5 h-5 fill-primary-60 inline-block" />
                </p>
                <div>
                    <div className="mb-8">
                        <h2 className="font-header text-primary font-semibold text-2xl mb-7">
                            Cementery Drive
                        </h2>
                        <p className="font-header text-primary text-l">
                            by My Chemical Romance
                        </p>
                        <p className="font-header text-primary text-l">
                            from Three Cheers for Sweet Revenge
                        </p>
                    </div>

                    <div className="flex flex-nowrap items-center gap-6">
                        <TextWithIcon text="3:08" icon="clock" iconClassName="stroke-primary-60 fill-none w-5 h-5" />

                        <span className="font-text text-primary-60 text-xs">
                            &#x2022;
                        </span>

                        <TextWithIcon text="89 957 800" icon="person" iconClassName="fill-primary-60 w-5 h-5" />

                        <span className="font-text text-primary-60 text-xs">
                            &#x2022;
                        </span>

                        <TextWithIcon text="08.06.2004" icon="calendar" iconClassName="stroke-primary-60 fill-none w-5 h-5" />
                    </div>
                </div>

                <FeaturedButton text="Play now" icon="play" />
            </div>
        </div>
    )
}

export default Featured
