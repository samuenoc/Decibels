"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, ShoppingCart, AlertCircle, CheckCircle } from "lucide-react"
import type { Song } from "@/lib/types"

interface PurchaseModalProps {
  song: Song | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (song: Song) => Promise<void>
  isLoading: boolean
  message?: string
  messageType?: "success" | "error" | "info"
}

export function PurchaseModal({
  song,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  message,
  messageType
}: PurchaseModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    if (!song) return
    
    setIsConfirming(true)
    try {
      await onConfirm(song)
    } finally {
      setIsConfirming(false)
    }
  }

  const getMessageIcon = () => {
    switch (messageType) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <ShoppingCart className="h-5 w-5 text-amber-500" />
    }
  }

  const getMessageColor = () => {
    switch (messageType) {
      case "success":
        return "text-green-500"
      case "error":
        return "text-red-500"
      default:
        return "text-amber-500"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-amber-500" />
            Comprar Canción
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres comprar esta canción?
          </DialogDescription>
        </DialogHeader>

        {song && (
          <div className="space-y-4">
            {/* Song Info */}
            <div className="bg-card/30 p-4 rounded-lg border border-border/50">
              <h3 className="font-semibold text-foreground">{song.title}</h3>
              <p className="text-sm text-muted-foreground">by {song.artist_name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-amber-500">{song.price} ETH</span>
                <span className="text-xs text-muted-foreground">
                  Artist: {song.artist_wallet?.slice(0, 6)}...{song.artist_wallet?.slice(-4)}
                </span>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`flex items-center gap-2 p-3 rounded-lg bg-card/20 border border-border/50 ${getMessageColor()}`}>
                {getMessageIcon()}
                <span className="text-sm">{message}</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isConfirming || isLoading}
            className="border-border/50 hover:bg-card/50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirming || isLoading || messageType === "success"}
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            {isConfirming || isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Procesando...
              </>
            ) : messageType === "success" ? (
              "Compra Exitosa"
            ) : (
              "Confirmar Compra"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
