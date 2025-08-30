"use client"

import { useState } from "react"
import type { Artist } from "@/lib/types"

interface UseArtistRegistrationReturn {
  artists: Artist[]
  registerArtist: (artistData: Omit<Artist, "id" | "created_at">) => Promise<Artist>
  isLoading: boolean
  error: string | null
}

export function useArtistRegistration(): UseArtistRegistrationReturn {
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const registerArtist = async (artistData: Omit<Artist, "id" | "created_at">): Promise<Artist> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call - replace with actual smart contract interaction later
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newArtist: Artist = {
        ...artistData,
        id: `artist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date(),
      }

      setArtists((prev) => [...prev, newArtist])
      return newArtist
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    artists,
    registerArtist,
    isLoading,
    error,
  }
}
