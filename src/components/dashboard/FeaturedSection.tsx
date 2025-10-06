import {useCallback, useEffect, useRef, useState} from "react"
import gsap from "gsap"
import SectionHeader from "../ui/SectionHeader"
import FeaturedSliderButtons from "./FeaturedSliderButtons"
import Featured from "./Featured"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchFeaturedData, selectFeatured, selectFeaturedStatus } from "../../features/featured/featuredSlice"
import placeholder from "../../assets/placeholders/song-placeholder.png"
import Error from "../ui/Error";
import Loader from "../ui/Loader";

const FeaturedSection = () => {
    // FETCH LOGIC
    const dispatch = useAppDispatch()

    const featuredData = useAppSelector(selectFeatured)
    const featuredDataStatus = useAppSelector(selectFeaturedStatus)

    const handleRetryFeatured = useCallback(() => {
        dispatch(fetchFeaturedData())
    }, [dispatch])

    // ANIMATION LOGIC
    const [currentSlide, setCurrentSlide] = useState<number>(0)
    const [prevSlide, setPrevSlide] = useState<number | null>(null)

    const directionRef = useRef<"next" | "prev">("next")
    const animatingRef = useRef(false)
    const slideRefs = useRef<Record<number, HTMLDivElement | null>>({})

    const slideTo = (newIndex: number, direction: "next" | "prev") => {
        if (animatingRef.current || newIndex === currentSlide) return
        directionRef.current = direction
        setPrevSlide(currentSlide)
        setCurrentSlide(newIndex)
    }

    const handlePrevious = () => {
        const next = currentSlide === 0 ? featuredData?.length - 1 : currentSlide - 1
        slideTo(next, "prev")
    }

    const handleNext = () => {
        const next = currentSlide === featuredData?.length - 1 ? 0 : currentSlide + 1
        slideTo(next, "next")
    }

    useEffect(() => {
        const outgoingIndex = prevSlide
        const incomingIndex = currentSlide

        if (outgoingIndex === null) return

        const outgoingEl = slideRefs.current[outgoingIndex]
        const incomingEl = slideRefs.current[incomingIndex]

        if (!outgoingEl || !incomingEl) {
            setPrevSlide(null)
            return
        }

        animatingRef.current = true
        const dir = directionRef.current
        const incomingStart = dir === "next" ? 100 : -100
        const outgoingEnd = dir === "next" ? -100 : 100

        gsap.set(incomingEl, { xPercent: incomingStart, opacity: 0 })

        const tl = gsap.timeline({
            defaults: { duration: 1, ease: "power2.out" },
            onComplete: () => {
                gsap.set(incomingEl, { clearProps: "all" })
                gsap.set(outgoingEl, { clearProps: "all" })
                setPrevSlide(null)
                animatingRef.current = false
            }
        })

        tl.to(outgoingEl, { xPercent: outgoingEnd, opacity: 0 }, 0)
        tl.to(incomingEl, { xPercent: 0, opacity: 1 }, 0)

        return () => {
            tl.kill()
        }
    }, [currentSlide, prevSlide])

    const renderSlide = (index: number) => (
        <div
            key={index}
            ref={el => { slideRefs.current[index] = el ?? null }}
            className={`col-start-1 row-start-1 min-w-0 w-full h-full ${index === currentSlide ? "pointer-events-auto" : "pointer-events-none"} shrink-0`}
        >
            <Featured
                artist={featuredData[index].artist}
                album={featuredData[index].albumName}
                song={featuredData[index].title}
                imageUrl={featuredData[index].coverImageUrl || placeholder}
                localSongPath={featuredData[index].localSongPath}
                releaseDate={featuredData[index].releaseDate}
                songLengthInSeconds={featuredData[index].songLengthInSeconds}
            />
        </div>
    )

    return (
        <section>
            <SectionHeader title="Featured" as="h1" right={<FeaturedSliderButtons onClickNext={handleNext} onClickPrev={handlePrevious} />} />

            <div className="grid overflow-hidden w-full h-full min-h-[320px]">
                { featuredDataStatus === "succeeded" && prevSlide !== null && renderSlide(prevSlide) }
                { featuredDataStatus === "succeeded" && renderSlide(currentSlide) }

                {
                    featuredDataStatus === "failed" && (
                        <Error text="featured section" handleRetry={handleRetryFeatured} />
                    )
                }

                {
                    featuredDataStatus === "loading" && (
                        <Loader size={96} stroke={4} />
                    )
                }
            </div>
        </section>
    )
}

export default FeaturedSection