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

  // Mock artists data - in real app this would come from API/blockchain
  const mockArtists = [
    { id: "artist_1", name: "CyberSynth" },
    { id: "artist_2", name: "NeonBeats" },
    { id: "artist_3", name: "DigitalDreamer" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Song title is required"
    }

    if (!formData.artist_id) {
      newErrors.artist_id = "Please select an artist"
    }

    if (!audioFile) {
      newErrors.audio_file = "Please upload an audio file"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate file upload and processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsSuccess(true)
    setIsSubmitting(false)

    if (onSubmit) {
      onSubmit({
        ...formData,
        audio_hash: `ipfs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })
    }

    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({ title: "", artist_id: "", artist_name: "", audio_hash: "", duration: 0 })
      setAudioFile(null)
    }, 3000)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleArtistSelect = (artistId: string) => {
    const artist = mockArtists.find((a) => a.id === artistId)
    setFormData((prev) => ({
      ...prev,
      artist_id: artistId,
      artist_name: artist?.name || "",
    }))
    if (errors.artist_id) {
      setErrors((prev) => ({ ...prev, artist_id: "" }))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("audio/")) {
      setAudioFile(file)
      // Simulate getting duration from file
      setFormData((prev) => ({ ...prev, duration: Math.floor(Math.random() * 300) + 60 }))
      if (errors.audio_file) {
        setErrors((prev) => ({ ...prev, audio_file: "" }))
      }
    } else {
      setErrors((prev) => ({ ...prev, audio_file: "Please select a valid audio file" }))
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
            <h3 className="text-2xl font-bold text-neon-green">Upload Successful!</h3>
            <p className="text-muted-foreground">
              Your song has been uploaded and is ready for blockchain integration. It will be available for streaming
              once smart contracts are deployed.
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
          Upload Your Music
        </CardTitle>
        <CardDescription>
          Share your music with the world. Upload your tracks and start earning from streams instantly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Song Title *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter your song title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`bg-input/50 border-border focus:border-cyber-pink ${
                errors.title ? "border-destructive" : ""
              }`}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist" className="text-foreground">
              Artist *
            </Label>
            <Select onValueChange={handleArtistSelect} value={formData.artist_id}>
              <SelectTrigger
                className={`bg-input/50 border-border focus:border-cyber-pink ${
                  errors.artist_id ? "border-destructive" : ""
                }`}
              >
                <SelectValue placeholder="Select artist" />
              </SelectTrigger>
              <SelectContent>
                {mockArtists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.id}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.artist_id && <p className="text-sm text-destructive">{errors.artist_id}</p>}
            <p className="text-xs text-muted-foreground">
              Don't see your artist profile? <span className="text-cyber-purple">Register as an artist first</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <FileAudio className="h-4 w-4" />
              Audio File *
            </Label>

            {!audioFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-cyber-pink bg-cyber-pink/10"
                    : errors.audio_file
                      ? "border-destructive bg-destructive/10"
                      : "border-border bg-input/20 hover:border-cyber-pink/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Drop your audio file here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black"
                >
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-4">Supported formats: MP3, WAV, FLAC, M4A (Max 100MB)</p>
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

          <div className="bg-card/30 rounded-lg p-4 border border-border/50">
            <h4 className="font-semibold text-cyber-purple mb-2">Upload Process</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Your audio file will be stored on IPFS for decentralized access</p>
              <p>• Metadata will be recorded on Arbitrum blockchain</p>
              <p>• Smart contracts will handle automatic royalty distribution</p>
              <p>• File processing may take a few minutes</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyber-pink hover:bg-cyber-pink/80 glow-pink"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading to IPFS...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Song
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>By uploading, you confirm you own the rights to this music.</p>
            <p className="mt-1">IPFS and smart contract integration coming soon.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
