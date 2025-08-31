"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle, Loader2, FileAudio, X, AlertCircle } from "lucide-react"
import { useSongUpload } from "@/hooks/use-song-upload"
import type { Song } from "@/lib/types"

interface SongUploadFormProps {
  onSubmit?: (song: Omit<Song, "id" | "created_at" | "plays">) => void
}

export function SongUploadForm({ onSubmit }: SongUploadFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    artist_name: "",
    artist_wallet: "",
    price: 0.001,
    audio_hash: "",
    duration: 0,
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadSong, isLoading, uploadMessage, messageType, clearMessage } = useSongUpload()
  const [isSuccess, setIsSuccess] = useState(false)

  // Get artist info from localStorage
  const getArtistInfo = () => {
    if (typeof window !== 'undefined') {
      const userEmail = localStorage.getItem('userEmail') || 'Unknown Artist'
      const walletAddress = localStorage.getItem('walletAddressX') || ''
      return { name: userEmail.split('@')[0], wallet: walletAddress }
    }
    return { name: 'Unknown Artist', wallet: '' }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "El título de la canción es obligatorio"
    }

    if (!formData.artist_name.trim()) {
      newErrors.artist_name = "El nombre del artista es obligatorio"
    }

    if (!formData.artist_wallet.trim()) {
      newErrors.artist_wallet = "La dirección del wallet es obligatoria"
    }

    if (formData.price <= 0) {
      newErrors.price = "El precio debe ser mayor a 0"
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

    clearMessage()
    
    try {
      const result = await uploadSong({
        title: formData.title,
        artist_name: formData.artist_name,
        artist_wallet: formData.artist_wallet,
        price: formData.price,
        audio_hash: formData.audio_hash,
        duration: formData.duration,
        isPurchased: false
      })

      if (result.success) {
        setIsSuccess(true)
        // Reset form after success
        setTimeout(() => {
          setIsSuccess(false)
          const artistInfo = getArtistInfo()
          setFormData({ 
            title: "", 
            artist_name: artistInfo.name, 
            artist_wallet: artistInfo.wallet, 
            price: 0.001,
            audio_hash: "", 
            duration: 0 
          })
          setAudioFile(null)
          clearMessage()
        }, 3000)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  // Initialize artist info on component mount
  useEffect(() => {
    const artistInfo = getArtistInfo()
    setFormData(prev => ({
      ...prev,
      artist_name: artistInfo.name,
      artist_wallet: artistInfo.wallet
    }))
  }, [])

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

          {/* Artist Name */}
          <div className="space-y-2">
            <Label htmlFor="artist_name" className="text-foreground">Nombre del Artista *</Label>
            <Input
              id="artist_name"
              type="text"
              placeholder="Tu nombre como artista"
              value={formData.artist_name}
              onChange={(e) => handleInputChange("artist_name", e.target.value)}
              className={`bg-input/50 border-border focus:border-cyber-pink ${errors.artist_name ? "border-destructive" : ""}`}
            />
            {errors.artist_name && <p className="text-sm text-destructive">{errors.artist_name}</p>}
          </div>

          {/* Artist Wallet */}
          <div className="space-y-2">
            <Label htmlFor="artist_wallet" className="text-foreground">Wallet del Artista *</Label>
            <Input
              id="artist_wallet"
              type="text"
              placeholder="0x..."
              value={formData.artist_wallet}
              onChange={(e) => handleInputChange("artist_wallet", e.target.value)}
              className={`bg-input/50 border-border focus:border-cyber-pink ${errors.artist_wallet ? "border-destructive" : ""}`}
            />
            {errors.artist_wallet && <p className="text-sm text-destructive">{errors.artist_wallet}</p>}
            <p className="text-xs text-muted-foreground">
              Dirección del wallet conectado
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-foreground">Precio por reproducción (ETH) *</Label>
            <Input
              id="price"
              type="number"
              step="0.0001"
              min="0.0001"
              placeholder="0.001"
              value={formData.price}
              onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
              className={`bg-input/50 border-border focus:border-cyber-pink ${errors.price ? "border-destructive" : ""}`}
            />
            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            <p className="text-xs text-muted-foreground">
              Precio que los usuarios pagarán por reproducir/comprar tu canción
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

          {/* Upload Status */}
          {uploadMessage && (
            <div className={`rounded-lg p-4 border ${
              messageType === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
              messageType === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}>
              <div className="flex items-center gap-2">
                {messageType === 'error' && <AlertCircle className="h-4 w-4" />}
                <p className="text-sm">{uploadMessage}</p>
              </div>
            </div>
          )}

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
            disabled={isLoading}
            className="w-full bg-cyber-pink hover:bg-cyber-pink/80 glow-pink"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo a Blockchain...
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
            <p className="mt-1">Tu canción se registrará en la blockchain de Arbitrum Sepolia.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
