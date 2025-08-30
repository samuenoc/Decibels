"use client"

import { useState, useEffect } from "react"
import type { Song, PlaybackState } from "@/lib/types"

interface UsePlaybackReturn extends PlaybackState {
  play: (song: Song) => void
  pause: () => void
  next: () => void
  previous: () => void
  seek: (progress: number) => void
  setVolume: (volume: number) => void
  volume: number
}

export function usePlayback(songs: Song[] = []): UsePlaybackReturn {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    currentSong: null,
    isPlaying: false,
    isLoading: false,
    progress: 0,
  })
  const [volume, setVolumeState] = useState(75)

  // Simulate progress when playing
  useEffect(() => {
    if (!playbackState.isPlaying || !playbackState.currentSong) return

    const interval = setInterval(() => {
      setPlaybackState((prev) => {
        const newProgress = prev.progress + 100 / (prev.currentSong?.duration || 180) // Progress per second
        if (newProgress >= 100) {
          // Song finished, go to next
          return { ...prev, progress: 0, isPlaying: false }
        }
        return { ...prev, progress: newProgress }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [playbackState.isPlaying, playbackState.currentSong])

  const play = (song: Song) => {
    setPlaybackState({
      currentSong: song,
      isPlaying: true,
      isLoading: false,
      progress: 0,
    })
  }

  const pause = () => {
    setPlaybackState((prev) => ({ ...prev, isPlaying: false }))
  }

  const next = () => {
    if (!playbackState.currentSong || songs.length === 0) return

    const currentIndex = songs.findIndex((s) => s.id === playbackState.currentSong?.id)
    const nextIndex = (currentIndex + 1) % songs.length
    play(songs[nextIndex])
  }

  const previous = () => {
    if (!playbackState.currentSong || songs.length === 0) return

    const currentIndex = songs.findIndex((s) => s.id === playbackState.currentSong?.id)
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1
    play(songs[prevIndex])
  }

  const seek = (progress: number) => {
    setPlaybackState((prev) => ({ ...prev, progress }))
  }

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume)
  }

  return {
    ...playbackState,
    volume,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
  }
}
