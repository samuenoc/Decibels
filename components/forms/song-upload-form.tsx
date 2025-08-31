"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle, Loader2, FileAudio, X } from "lucide-react"
import type { Song } from "@/lib/types"

interface SongUploadFormProps {
  onSubmit?: (song: Omit<Song, "id" | "created_at" | "plays">) => void
}

export function SongUploadForm({ onSubmit }: SongUploadFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    artist_id: "",
    artist_name: "",
    audio_hash: "",
    duration: 0,
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Datos de artistas de ejemplo
  const mockArtists = [
    { id: "artist_1", name: "CyberSynth" },
    { id: "artist_2", name: "NeonBeats" },
    { id: "artist_3", name: "DigitalDreamer" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "El título de la canción es obligatorio"
    }

    if (!formData.artist_id) {
      newErrors.artist_id = "Por favor selecciona un artista"
    }

    if (!audioFile) {
      newErrors.audio_file = "Por favor sube un archivo de audio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 3000)) // Simula carga de archivo
    setIsSuccess(true)
    setIsSubmitting(false)

    if (onSubmit) {
      onSubmit({
        ...formData,
        audio_hash: `ipfs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })
    }

    // Resetear formulario después de éxito
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({ title: "", artist_id: "", artist_name: "", audio_hash: "", duration: 0 })
      setAudioFile(null)
    }, 3000)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleArtistSelect = (artistId: string) => {
    const artist = mockArtists.find((a) => a.id === artistId)
    setFormData((prev) => ({
      ...prev,
      artist_id: artistId,
      artist_name: artist?.name || "",
    }))
    if (errors.artist_id) setErrors((prev) => ({ ...prev, artist_id: "" }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) handleFileSelect(files[0])
  }

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("audio/")) {
      setAudioFile(file)
      setFormData((prev) => ({ ...prev, duration: Math.floor(Math.random() * 300) + 60 }))
      if (errors.audio_file) setErrors((prev) => ({ ...prev, audio_file: "" }))
    } else {
      setErrors((prev) => ({ ...prev, audio_file: "Selecciona un archivo de audio válido" }))
    }
  }

  const removeFile = () => {
    setAudioFile(null)
    setFormData((prev) => ({ ...prev, duration: 0 }))
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto bg-card/50 border-neon-green/40 glow-green">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-neon-green mx-auto" />
            <h3 className="text-2xl font-bold text-neon-green">¡Subida exitosa!</h3>
            <p className="text-muted-foreground">
              Tu canción ha sido subida y está lista para integración en blockchain.
              Estará disponible para streaming una vez se desplieguen los smart contracts.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto bg-card/50 border-cyber-pink/20">
      <CardHeader>
        <CardTitle className="text-2xl text-cyber-pink flex items-center gap-2">
          <Upload className="h-6 w-6" />
          Subir tu música
        </CardTitle>
        <CardDescription>
          Comparte tu música con el mundo. Sube tus canciones y empieza a ganar con las reproducciones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Título de la canción *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Ingresa el título de tu canción"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`bg-input/50 border-border focus:border-cyber-pink ${errors.title ? "border-destructive" : ""}`}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Artista */}
          <div className="space-y-2">
            <Label htmlFor="artist" className="text-foreground">Artista *</Label>
            <Select onValueChange={handleArtistSelect} value={formData.artist_id}>
              <SelectTrigger
                className={`bg-input/50 border-border focus:border-cyber-pink ${errors.artist_id ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Selecciona un artista" />
              </SelectTrigger>
              <SelectContent>
                {mockArtists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.artist_id && <p className="text-sm text-destructive">{errors.artist_id}</p>}
            <p className="text-xs text-muted-foreground">
              ¿No ves tu perfil de artista? <span className="text-cyber-purple">Regístrate primero como artista</span>
            </p>
          </div>

          {/* Archivo de audio */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <FileAudio className="h-4 w-4" /> Archivo de audio *
            </Label>

            {!audioFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-cyber-pink bg-cyber-pink/10"
                    : errors.audio_file ? "border-destructive bg-destructive/10"
                      : "border-border bg-input/20 hover:border-cyber-pink/50"
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Suelta tu archivo de audio aquí</p>
                <p className="text-sm text-muted-foreground mb-4">o haz clic para seleccionar</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black"
                >
                  Seleccionar archivo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-4">Formatos soportados: MP3, WAV, FLAC, M4A (máx 100MB)</p>
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4 bg-input/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileAudio className="h-8 w-8 text-cyber-pink" />
                    <div>
                      <p className="font-medium">{audioFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(audioFile.size)} • {formatDuration(formData.duration)}
                      </p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {errors.audio_file && <p className="text-sm text-destructive">{errors.audio_file}</p>}
          </div>

          {/* Proceso de subida */}
          <div className="bg-card/30 rounded-lg p-4 border border-border/50">
            <h4 className="font-semibold text-cyber-purple mb-2">Proceso de subida</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Tu archivo se almacenará en IPFS para acceso descentralizado</p>
              <p>• Los metadatos se registrarán en la blockchain de Arbitrum</p>
              <p>• Los smart contracts manejarán la distribución automática de regalías</p>
              <p>• El procesamiento puede tardar unos minutos</p>
            </div>
          </div>

          {/* Botón de subir */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyber-pink hover:bg-cyber-pink/80 glow-pink"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo a IPFS...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Subir Canción
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Al subir, confirmas que posees los derechos de esta música.</p>
            <p className="mt-1">Integración con IPFS y smart contracts próximamente.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
