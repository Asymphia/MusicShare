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
import type { ListeningHistoryItemDto } from "../api/listeningHistoryApi"
import type { SongDto } from "../api/songsApi"

const API_BASE = import.meta.env.VITE_API_BASE

export const usePlayer = () => {
    const dispatch = useAppDispatch()
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const currentSong = useAppSelector(selectCurrentSong) as ListeningHistoryItemDto
    const isPlaying = useAppSelector(selectIsPlaying)
    const currentTime = useAppSelector(selectCurrentTime)
    const duration = useAppSelector(selectDuration)
    const allSongs = useAppSelector(selectSongs)

    useEffect(() => {
        if(!audioRef.current) {
            audioRef.current = new Audio()
            audioRef.current.preload = "metadata"
        }

        const audio = audioRef.current

        const handleTimeUpdate = () => {
            dispatch(setCurrentTime(audio.currentTime))
        }

        const handleLoadedMetadata = () => {
            dispatch(setDuration(audio.duration))
        }

        const handleEnded = async () => {
            dispatch(setIsPlaying(false))

            if(currentSong) {
                await dispatch(postAndRefetchHistory({
                    spotifySongId: currentSong.songShort.spotifyId,
                    playlistId: currentSong.playlistShort?.id
                }))

                dispatch(fetchListeningHistory(4))
                playRandomSong()
            }
        }

        audio.addEventListener("timeupdate", handleTimeUpdate)
        audio.addEventListener("loadedmetadata", handleLoadedMetadata)
        audio.addEventListener("ended", handleEnded)

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate)
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
            audio.removeEventListener("ended", handleEnded)
        }
    }, [dispatch, currentSong])

    useEffect(() => {
        if(!audioRef.current) return

        if(isPlaying) {
            audioRef.current.play().catch(err => {
                console.error("Playing song failed: ", err)
                dispatch(setIsPlaying(false))
            })
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying, dispatch])

    useEffect(() => {
        if(!audioRef.current || !currentSong) return
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
                console.log(url)

                const audio = audioRef.current!
                audio.pause()
                audio.src = url
                audio.load()

                dispatch(setCurrentTime(0))

                if (cancelled) return

                if (isPlaying) {
                    audio.play().catch(err => {
                        console.error("Playing song failed after load: ", err)
                        dispatch(setIsPlaying(false))
                    })
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

    const convertSongToHistoryItem = useCallback((song: SongDto): ListeningHistoryItemDto => {
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
            playlistShort: null,
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
        if (!audioRef.current) return
        audioRef.current.currentTime = time
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
        playRandomSong
    }
}