"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import type { Song } from "@/lib/types"

interface PlaybackControlsProps {
  currentSong: Song | null
  isPlaying: boolean
  progress: number
  volume: number
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrevious: () => void
  onSeek: (progress: number) => void
  onVolumeChange: (volume: number) => void
}

export function PlaybackControls({
  currentSong,
  isPlaying,
  progress,
  volume,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
}: PlaybackControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!currentSong) {
    return (
      <Card className="fixed bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-muted-foreground">
            <Music className="h-5 w-5 mr-2" />
            <span>Select a song to start playing</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentTime = (progress / 100) * (currentSong.duration || 0)
  const totalTime = currentSong.duration || 0

  return (
    <Card className="fixed bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border-cyber-pink/30 glow-pink">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 bg-cyber-pink/20 rounded-lg flex items-center justify-center">
              <Music className="h-6 w-6 text-cyber-pink" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-cyber-pink truncate">{currentSong.title}</h4>
              <p className="text-sm text-muted-foreground truncate">by {currentSong.artist_name}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onPrevious}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-cyber-purple"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              onClick={isPlaying ? onPause : onPlay}
              size="lg"
              className="rounded-full w-10 h-10 p-0 bg-cyber-pink hover:bg-cyber-pink/80 glow-pink"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>

            <Button
              onClick={onNext}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-cyber-purple"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
            <Slider
              value={[progress]}
              onValueChange={(value) => onSeek(value[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">{formatTime(totalTime)}</span>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              onValueChange={(value) => onVolumeChange(value[0])}
              max={100}
              step={1}
              className="w-20"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
