import { useRef, useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
    setCurrentSong,
    togglePlayPause,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    seekTo,
    selectCurrentSong,
    selectIsPlaying,
    selectCurrentTime,
    selectDuration,
    postAndRefetchHistory
} from "../features/listeningHistory/playerSlice"
import { fetchListeningHistory } from "../features/listeningHistory/listeningHistorySlice"
import {fetchSongById, selectSongs} from "../features/songs/songsSlice"
import type {ListeningHistoryItemDto, PlaylistShortDto} from "../api/listeningHistoryApi"
import type { SongDto } from "../api/songsApi"

const API_BASE = import.meta.env.VITE_API_BASE

let sharedAudio: HTMLAudioElement | null = null
let listenersAttached = false

const currentSongRefModule: { current: ListeningHistoryItemDto | null } = { current: null }
const allSongsRefModule: { current: SongDto[] | null } = { current: null }
const isPlayingRefModule: { current: boolean } = { current: false }

const getSharedAudio = () => {
    if (typeof window === "undefined") return null
    if (!sharedAudio) {
        sharedAudio = new Audio()
        sharedAudio.preload = "metadata"
    }
    return sharedAudio
}

export const usePlayer = () => {
    const dispatch = useAppDispatch()
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const currentSong = useAppSelector(selectCurrentSong) as ListeningHistoryItemDto
    const isPlaying = useAppSelector(selectIsPlaying)
    const currentTime = useAppSelector(selectCurrentTime)
    const duration = useAppSelector(selectDuration)
    const allSongs = useAppSelector(selectSongs)

    useEffect(() => {
        audioRef.current = getSharedAudio()
    }, [])

    useEffect(() => { currentSongRefModule.current = currentSong }, [currentSong])
    useEffect(() => { allSongsRefModule.current = allSongs }, [allSongs])
    useEffect(() => { isPlayingRefModule.current = isPlaying }, [isPlaying])

    const playInProgressRef = useRef(false)

    const tryPlay = useCallback(async () => {
        const audio = audioRef.current
        if (!audio) return
        if (playInProgressRef.current) return
        if (!isPlayingRefModule.current) return

        playInProgressRef.current = true
        try {
            await audio.play()
        } catch (err: any) {
            if (err && (err.name === "AbortError" || err.code === "ABORT_ERR")) {
            } else {
                console.error("Playing song failed: ", err)
                dispatch(setIsPlaying(false))
            }
        } finally {
            playInProgressRef.current = false
        }
    }, [dispatch])

    useEffect(() => {
        const audio = getSharedAudio()
        if (!audio || listenersAttached) return

        const handleTimeUpdate = () => {
            dispatch(setCurrentTime(audio.currentTime))
        }

        const handleLoadedMetadata = () => {
            dispatch(setDuration(audio.duration))
        }

        const handleEnded = async () => {
            dispatch(setIsPlaying(false))

            if(currentSongRefModule.current) {
                await dispatch(postAndRefetchHistory({
                    spotifySongId: currentSongRefModule.current.songShort.spotifyId,
                    playlistId: currentSongRefModule.current.playlistShort?.id
                }))

                dispatch(fetchListeningHistory(4))
                playRandomSong()
            }
        }

        audio.addEventListener("timeupdate", handleTimeUpdate)
        audio.addEventListener("loadedmetadata", handleLoadedMetadata)
        audio.addEventListener("ended", handleEnded)

        listenersAttached = true
    }, [dispatch])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        if(isPlaying) {
           void tryPlay()
        } else {
            try { audio.pause() } catch {}
        }
    }, [isPlaying, dispatch])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !currentSong) return
        let cancelled = false

        const loadAndPlay = async () => {
            try {
                const songDto: SongDto = await dispatch(fetchSongById({ songId: currentSong.songShort.spotifyId })).unwrap()
                const rawPath = songDto.localSongPath ?? ""
                const fileName = rawPath.replace(/^.*[\\\/]/, "")

                if (!fileName) {
                    console.error("No localSongPath/filename available for song:", songDto)
                    return
                }

                const url = `${API_BASE}/files/${encodeURIComponent(fileName)}`

                const same = (() => {
                    try {
                        return audio.src === url || audio.src.endsWith(encodeURI(fileName)) || audio.src.endsWith(fileName)
                    } catch {
                        return false
                    }
                })()

                if (!same) {
                    audio.pause()
                    audio.src = url
                    audio.load()
                    dispatch(setCurrentTime(0))
                }

                if (cancelled) return

                if (isPlayingRefModule.current) {
                    void tryPlay()
                }
            } catch (err) {
                console.error("Failed to fetch song by id:", err)
                dispatch(setIsPlaying(false))
            }
        }

        loadAndPlay()

        return () => {
            cancelled = true
        }
    }, [currentSong, dispatch, isPlaying])

    const convertSongToHistoryItem = useCallback((song: SongDto, playlist?: PlaylistShortDto): ListeningHistoryItemDto => {
        return {
            id: `temp-${Date.now()}-${Math.random()}`,
            dateTime: new Date().toISOString(),
            songShort: {
                spotifyId: song.spotifyId,
                title: song.title,
                coverImageUrl: song.coverImageUrl,
                songLengthInSeconds: song.songLengthInSeconds,
                releaseDate: song.releaseDate
            },
            playlistShort: playlist ? playlist : null,
            genreShortModelDTO: []
        }
    }, [])

    const playSong = useCallback((song: ListeningHistoryItemDto) => {
        dispatch(setCurrentSong(song))
        dispatch(setIsPlaying(true))
    }, [dispatch])

    const play = useCallback(() => {
        dispatch(setIsPlaying(true))
    }, [dispatch])

    const pause = useCallback(() => {
        dispatch(setIsPlaying(false))
    }, [dispatch])

    const toggle = useCallback(() => {
        dispatch(togglePlayPause())
    }, [dispatch])

    const seek = useCallback((time: number) => {
        const audio = audioRef.current
        if (!audio) return
        audio.currentTime = time
        dispatch(seekTo(time))
    }, [dispatch])

    const playRandomSong = useCallback(() => {
        const availableSongs = allSongs.filter(
            song => song.hasLocalSong && song.localSongPath && song.songLengthInSeconds
        )

        if (availableSongs.length === 0) {
            dispatch(setIsPlaying(false))
            return
        }

        const randomIndex = Math.floor(Math.random() * availableSongs.length)
        const randomSong = availableSongs[randomIndex]
        const historyItem = convertSongToHistoryItem(randomSong)

        playSong(historyItem)
    }, [allSongs, dispatch, convertSongToHistoryItem, playSong])

    const next = useCallback(() => {
        playRandomSong()
    }, [playRandomSong])

    /* TODO: TUTAJ PREVIOUS BRAĆ Z LISTENING HISTORY */
    const previous = useCallback(() => {
        if (currentTime > 3) {
            seek(0)
        } else {
            playRandomSong()
        }
    }, [currentTime, seek, playRandomSong])

    return {
        currentSong,
        isPlaying,
        currentTime,
        duration,
        playSong,
        play,
        pause,
        toggle,
        seek,
        next,
        previous,
        playRandomSong,
        convertSongToHistoryItem
    }
}