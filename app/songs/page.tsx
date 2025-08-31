"use client"

import { useState } from "react"
import { SongCard } from "@/components/music/song-card"
import { PlaybackControls } from "@/components/music/playback-controls"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Music, TrendingUp } from "lucide-react"
import type { Song } from "@/lib/types"

// Datos de ejemplo - en una app real esto vendría de una API/blockchain
const mockSongs: Song[] = [
  {
    id: "song_1",
    title: "Neon Dreams",
    artist_id: "artist_1",
    artist_name: "CyberSynth",
    duration: 245,
    plays: 15420,
    created_at: new Date("2024-01-15"),
  },
  {
    id: "song_2",
    title: "Digital Horizon",
    artist_id: "artist_2",
    artist_name: "NeonBeats",
    duration: 198,
    plays: 8750,
    created_at: new Date("2024-01-20"),
  },
  {
    id: "song_3",
    title: "Electric Pulse",
    artist_id: "artist_1",
    artist_name: "CyberSynth",
    duration: 312,
    plays: 23100,
    created_at: new Date("2024-01-10"),
  },
  {
    id: "song_4",
    title: "Cyber Rain",
    artist_id: "artist_3",
    artist_name: "DigitalDreamer",
    duration: 267,
    plays: 5420,
    created_at: new Date("2024-01-25"),
  },
  {
    id: "song_5",
    title: "Matrix Flow",
    artist_id: "artist_2",
    artist_name: "NeonBeats",
    duration: 189,
    plays: 12300,
    created_at: new Date("2024-01-18"),
  },
]

export default function SongsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "title">("popular")

  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(75)

  const handlePlay = async (song: Song) => {
    setIsLoading(true)
    // Simular tiempo de carga
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setCurrentSong(song)
    setIsPlaying(true)
    setIsLoading(false)
    setProgress(0)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleNext = () => {
    if (!currentSong) return
    const currentIndex = mockSongs.findIndex((song) => song.id === currentSong.id)
    const nextIndex = (currentIndex + 1) % mockSongs.length
    setCurrentSong(mockSongs[nextIndex])
    setProgress(0)
  }

  const handlePrevious = () => {
    if (!currentSong) return
    const currentIndex = mockSongs.findIndex((song) => song.id === currentSong.id)
    const prevIndex = currentIndex === 0 ? mockSongs.length - 1 : currentIndex - 1
    setCurrentSong(mockSongs[prevIndex])
    setProgress(0)
  }

  const handleSeek = (newProgress: number) => {
    setProgress(newProgress)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
  }

  const filteredSongs = mockSongs
    .filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist_name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.plays - a.plays
        case "recent":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const totalPlays = mockSongs.reduce((sum, song) => sum + song.plays, 0)
  const totalSongs = mockSongs.length
  const totalArtists = new Set(mockSongs.map((song) => song.artist_id)).size

  return (
    <div className="space-y-8 pb-32">
      {/* Encabezado */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance">
          <span className="text-cyber-purple">Descubre</span>{" "}
          <span className="text-cyber-pink">Música</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Explora las últimas canciones de artistas de todo el mundo. Reproduce música impulsada por tecnología blockchain.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-card/30 border-cyber-purple/20 text-center p-4">
          <Music className="h-8 w-8 text-cyber-purple mx-auto mb-2" />
          <div className="text-2xl font-bold text-cyber-purple">{totalSongs}</div>
          <div className="text-sm text-muted-foreground">Canciones Disponibles</div>
        </Card>

        <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
          <TrendingUp className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
          <div className="text-2xl font-bold text-cyber-pink">{totalPlays.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Reproducciones Totales</div>
        </Card>

        <Card className="bg-card/30 border-electric-blue/20 text-center p-4">
          <div className="h-8 w-8 bg-electric-blue rounded-full mx-auto mb-2 flex items-center justify-center text-black font-bold">
            {totalArtists}
          </div>
          <div className="text-2xl font-bold text-electric-blue">{totalArtists}</div>
          <div className="text-sm text-muted-foreground">Artistas Activos</div>
        </Card>
      </div>

      {/* Búsqueda y Filtros */}
      <Card className="bg-card/30 border-border/50">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar canciones o artistas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input/50 border-border focus:border-cyber-purple"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                onClick={() => setSortBy("popular")}
                className={
                  sortBy === "popular"
                    ? "bg-cyber-purple hover:bg-cyber-purple/80"
                    : "border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black"
                }
              >
                Popular
              </Button>
              <Button
                variant={sortBy === "recent" ? "default" : "outline"}
                onClick={() => setSortBy("recent")}
                className={
                  sortBy === "recent"
                    ? "bg-cyber-pink hover:bg-cyber-pink/80"
                    : "border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black"
                }
              >
                Recientes
              </Button>
              <Button
                variant={sortBy === "title" ? "default" : "outline"}
                onClick={() => setSortBy("title")}
                className={
                  sortBy === "title"
                    ? "bg-electric-blue hover:bg-electric-blue/80"
                    : "border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-black"
                }
              >
                A-Z
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de canciones */}
      <div className="space-y-4">
        {filteredSongs.length === 0 ? (
          <Card className="bg-card/30 border-border/50">
            <CardContent className="p-8 text-center">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron canciones</h3>
              <p className="text-muted-foreground">Prueba ajustando tu búsqueda o criterios de filtro</p>
            </CardContent>
          </Card>
        ) : (
          filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id && isPlaying}
              isLoading={currentSong?.id === song.id && isLoading}
              onPlay={handlePlay}
              onPause={handlePause}
            />
          ))
        )}
      </div>

      {/* Controles de reproducción */}
      <PlaybackControls
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        volume={volume}
        onPlay={() => currentSong && handlePlay(currentSong)}
        onPause={handlePause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  )
}
