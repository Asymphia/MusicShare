import SectionHeader from "./SectionHeader.tsx"
import Icon from "./Icon.tsx"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import { fetchPlaylists, postSongToPlaylist, selectPlaylists, selectPlaylistsStatus } from "../../features/playlists/playlistsSlice.ts"
import ExtendedEntityBlock from "./ExtendedEntityBlock.tsx"
import placeholder from "../../assets/placeholders/album-cover-placeholder.png"
import MorphIcon from "./MorphIcon.tsx"
import { type ChangeEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type MouseEvent } from "react"
import useDebounce from "../../hooks/useDebounce.ts"
import Error from "./Error.tsx"
import Loader from "./Loader.tsx"
import gsap from "gsap"
import { createPortal } from "react-dom"
import FeaturedButton from "./FeaturedButton"

interface AddToPlaylistPopupProps {
    isOpen: boolean
    close: () => void
    songId: string
    portalContainer?: HTMLElement | null
}

export type AddToPlaylistPopupHandle = {
    focusInput: () => void
    close: () => void
}

const AddToPlaylistPopup = forwardRef<AddToPlaylistPopupHandle, AddToPlaylistPopupProps>(({ isOpen, close, songId, portalContainer = null }, ref) => {
    const dispatch = useAppDispatch()
    const playlists = useAppSelector(selectPlaylists)
    const playlistsStatus = useAppSelector(selectPlaylistsStatus)

    const [render, setRender] = useState<boolean>(isOpen)
    const [playlistsId, setPlaylistsId] = useState<number[]>([])
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const debouncedSearchQuery = useDebounce(searchQuery, 150)

    const overlayRef = useRef<HTMLDivElement | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const containerRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if(portalContainer) {
            containerRef.current = portalContainer
        } else if (typeof document !== "undefined") {
            containerRef.current = document.body
        }
    }, [portalContainer])

    useImperativeHandle(ref, () => ({
        focusInput: () => inputRef.current?.focus(),
        close: () => close()
    }), [close])

    useEffect(() => {
        if(isOpen) {
            setRender(true)

            requestAnimationFrame(() => {
                if(panelRef.current) {
                    gsap.killTweensOf(panelRef.current)
                    gsap.fromTo(panelRef.current,
                        { autoAlpha: 0, y: -8 },
                        { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }
                    )
                }
            })

            if(overlayRef.current) {
                gsap.killTweensOf(overlayRef.current)
                gsap.fromTo(overlayRef.current,
                    { autoAlpha: 0, y: -8 },
                    { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }
                )
            }

            setTimeout(() => inputRef.current?.focus(), 80)
        } else if (render) {
            if(panelRef.current || overlayRef.current) {
                const tl = gsap.timeline({
                    onComplete: () => setRender(false)
                })

                if(panelRef.current) {
                    tl.to(panelRef.current, {
                        autoAlpha: 0, y: -8, duration: 0.18, ease: "power2.in"
                    })
                }

                if(overlayRef.current) {
                    tl.to(overlayRef.current, {
                        autoAlpha: 0, y: -8, duration: 0.18, ease: "power2.in"
                    }, 0)
                }
            }
        } else {
            setRender(false)
        }
    }, [isOpen, render])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if(e.key === "Escape") close()
        }

        if (render) {
            window.addEventListener("keydown", onKey)
            return () => window.removeEventListener("keydown", onKey)
        }
    }, [render, close])

    const filteredPlaylists = useMemo(() => {
        if(!playlists || !Array.isArray(playlists)) return []

        if(!debouncedSearchQuery.trim()) return playlists

        const query = debouncedSearchQuery.toLowerCase()

        return playlists.filter(playlist => {
            if (playlist.name?.toLowerCase().includes(query)) return true
            if (playlist.ownerName?.toLowerCase().includes(query)) return true
            return false
        })

    }, [playlists, debouncedSearchQuery])

    const displayedPlaylists = useMemo(() => {
        return filteredPlaylists.slice(0, 4)
    }, [filteredPlaylists])

    const togglePlaylistId = useCallback((id: number) => {
        setPlaylistsId(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id])
    }, [])

    const handleAddToPlaylist = useCallback(async () => {
        setError(null)

        if(playlistsId.length === 0) {
            close()
            return
        }

        try {
            await Promise.all(playlistsId.map(playlistId => {
                dispatch(postSongToPlaylist({ playlistId, songId })).unwrap()
            }))

            close()
            setPlaylistsId([])
        } catch (err) {
            setError("Failed to add song to playlist.")
        }
    }, [dispatch, playlistsId, songId, close])

    const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    const handleRetryPlaylists = useCallback(() => {
        dispatch(fetchPlaylists())
    }, [dispatch])

    const handleOverlayMouseDown = (e: MouseEvent) => {
        if(e.target === overlayRef.current) {
            close()
        }
    }

    if(!render || !containerRef.current) return null

    return createPortal(
        <div ref={overlayRef} onMouseDown={handleOverlayMouseDown} className="fixed inset-0 z-50 flex items-start justify-center p-9" aria-hidden={!isOpen} style={{ background: "rgba(6,6,8,0.3)" }}>
            <div ref={panelRef} role="dialog" aria-modal="true" className="bg-bg-primary p-8 rounded-3xl w-full max-w-[460px] shadow-2xl space-y-8" onMouseDown={e => e.stopPropagation()}>
                <SectionHeader title="Add to playlist" as="h4" />

                <label className="group flex flex-nowrap space-x-3 items-center border-b-solid border-b border-b-primary-60 pb-2 transition hover:border-b-primary-80 w-full">
                    <Icon size={24}
                          name="search"
                          className="w-6 h-6 fill-primary-60 transition group-hover:fill-primary-80"
                    />

                    <input type="text" placeholder="Search for a playlist..." ref={ inputRef } value={ searchQuery } onChange={ handleSearchChange }
                           className="font-text text-xs text-primary-60 focus:outline-none w-full transition placehoder:transition
                            placeholder:text-primary-60 group-hover:text-primary-80 group-hover:placeholder:text-primary-80 focus:text-primary focus:placeholder:text-primary"
                    />
                </label>

                <div className="space-y-3 w-full">

                    {
                        playlistsStatus === "succeeded" && displayedPlaylists.map(playlist => (
                            <div key={playlist.id} className="flex flex-nowrap justify-between w-full overflow-hidden gap-4">
                                <div className="min-w-0 flex-1 overflow-hidden">
                                    <ExtendedEntityBlock isTop={false} image={playlist.coverImageUrl || placeholder}
                                                         type="playlist" playlist={playlist.name}
                                                         creator={playlist.ownerName || "unknown"} id={playlist.id}
                                                         songAmount={playlist.songs?.length || 0} duration={0}/>
                                </div>
                                <button type="button" className="flex-shrink-0 h-fit mt-2" onClick={() => togglePlaylistId(playlist.id)} aria-pressed={playlistsId.includes(playlist.id)}>
                                    <MorphIcon isChecked={playlistsId.includes(playlist.id)} className="cursor-pointer fill-primary-60 hover:fill-primary-80 active:fill-primary"/>
                                </button>
                            </div>
                        ))
                    }

                    {
                        playlistsStatus === "failed" && (
                            <Error text="playlists" handleRetry={handleRetryPlaylists} />
                        )
                    }

                    {
                        playlistsStatus === "loading" && (
                            <Loader size={48} stroke={3} />
                        )
                    }

                    {
                        playlistsStatus === "succeeded" && displayedPlaylists.length === 0 && (
                            <p className="font-text text-xs text-primary-60">
                                No playlist found. :(
                            </p>
                        )
                    }

                    {
                        error && (
                            <p className="font-text text-xs text-primary-60">{ error }</p>
                        )
                    }
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <FeaturedButton text="Cancel" onClick={() => close()} className="w-full justify-center" />
                    <FeaturedButton text="Add" onClick={() => handleAddToPlaylist()} className="w-full justify-center" />
                </div>
            </div>
        </div>,
        containerRef.current
    )
})

export default AddToPlaylistPopup