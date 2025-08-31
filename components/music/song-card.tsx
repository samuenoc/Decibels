"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Loader2, Music, Lock } from "lucide-react"
import type { Song } from "@/lib/types"
import { useValidation } from "@/hooks/use-validation"
import { useSongPurchase } from "@/hooks/use-song-purchase"
import { PurchaseModal } from "@/components/music/purchase-modal"

interface SongCardProps {
  song: Song
  isPlaying?: boolean
  isLoading?: boolean
  onPlay?: (song: Song) => void
  onPause?: () => void
  onPurchaseSuccess?: (songId: string) => void
}

export function SongCard({ song, isPlaying = false, isLoading = false, onPlay, onPause, onPurchaseSuccess }: SongCardProps) {
  const [localLoading, setLocalLoading] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const { validateAccess } = useValidation()
  const { purchaseSong, isPurchasing, purchaseMessage, messageType, clearMessage } = useSongPurchase()

  const handlePlayClick = async () => {
    if (isPlaying) {
      onPause?.()
      return
    }

    // Check if song is purchased first
    if (!song.isPurchased) {
      return // Don't allow play if not purchased
    }

    // Validate access before playing
    if (!validateAccess()) {
      return
    }

    setLocalLoading(true)
    // Simulate loading time for blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLocalLoading(false)
    onPlay?.(song)
  }

  const handlePurchaseClick = () => {
    // Validate access first
    if (!validateAccess()) {
      return
    }
    
    clearMessage()
    setShowPurchaseModal(true)
  }

  const handlePurchaseConfirm = async (songToPurchase: Song) => {
    // Get user wallet from localStorage or Rabby
    let userWallet = ""
    try {
      if (window.rabby) {
        const accounts = await window.rabby.request({ method: 'eth_accounts' })
        userWallet = accounts[0] || ""
      }
    } catch (error) {
      console.error('Error getting wallet:', error)
    }

    const result = await purchaseSong(songToPurchase.id, songToPurchase.artist_wallet, songToPurchase.price)
    
    if (result.success) {
      // Close modal after success and small delay
      setTimeout(() => {
        setShowPurchaseModal(false)
        if (onPurchaseSuccess) {
          onPurchaseSuccess(songToPurchase.id)
        }
      }, 1500)
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`
    return plays.toString()
  }

  return (
    <Card
      className={`bg-card/50 border transition-all duration-300 hover:bg-card/70 ${isPlaying ? "border-cyber-pink glow-pink" : "border-border hover:border-cyber-purple/50"
        }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Play/Purchase Button */}
          {song.isPurchased ? (
            <Button
              onClick={handlePlayClick}
              disabled={localLoading || isLoading}
              size="lg"
              className={`rounded-full w-12 h-12 p-0 ${isPlaying
                ? "bg-cyber-pink hover:bg-cyber-pink/80 glow-pink"
                : "bg-cyber-purple hover:bg-cyber-purple/80 glow-purple"
                }`}
            >
              {localLoading || isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
          ) : (
            <Button
              onClick={handlePurchaseClick}
              disabled={isPurchasing}
              size="lg"
              className="rounded-full w-12 h-12 p-0 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
            >
              {isPurchasing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Comprar"
              )}
            </Button>
          )}

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {song.isPurchased ? (
                <Music className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <Lock className="h-4 w-4 text-amber-500 flex-shrink-0" />
              )}
              <h3 className={`font-semibold truncate ${isPlaying ? "text-cyber-pink" : song.isPurchased ? "text-foreground" : "text-muted-foreground"}`}>
                {song.title}
              </h3>
              {!song.isPurchased && (
                <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded-full">
                  {song.price} ETH
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">by {song.artist_name}</p>
            {!song.isPurchased && (
              <p className="text-xs text-amber-500 mt-1">Purchase to unlock</p>
            )}
          </div>

          {/* Stats */}
          <div className="text-right text-sm text-muted-foreground">
            <div>{formatDuration(song.duration)}</div>
            <div className="text-xs">{formatPlays(song.plays)} plays</div>
          </div>
        </div>

        {/* Progress Bar (when playing) */}
        {isPlaying && (
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-1">
              <div
                className="bg-cyber-pink h-1 rounded-full transition-all duration-1000 animate-pulse"
                style={{ width: "35%" }}
              />
            </div>
          </div>
        )}
      </CardContent>

      {/* Purchase Modal */}
      <PurchaseModal
        song={showPurchaseModal ? song : null}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onConfirm={handlePurchaseConfirm}
        isLoading={isPurchasing}
        message={purchaseMessage}
        messageType={messageType}
      />
    </Card>
  )
}
