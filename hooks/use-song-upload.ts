"use client"

import { useState } from "react"
import type { Song } from "@/lib/types"

interface UseSongUploadReturn {
  songs: Song[]
  uploadSong: (songData: Omit<Song, "id" | "created_at" | "plays">) => Promise<Song>
  isLoading: boolean
  error: string | null
}

export function useSongUpload(): UseSongUploadReturn {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadSong = async (songData: Omit<Song, "id" | "created_at" | "plays">): Promise<Song> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate IPFS upload and blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const newSong: Song = {
        ...songData,
        id: `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        plays: 0,
        created_at: new Date(),
      }

      setSongs((prev) => [...prev, newSong])
      return newSong
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    songs,
    uploadSong,
    isLoading,
    error,
  }
}
