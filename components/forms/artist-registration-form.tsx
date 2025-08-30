"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Wallet, Upload, CheckCircle, Loader2 } from "lucide-react"
import type { Artist } from "@/lib/types"

interface ArtistRegistrationFormProps {
  onSubmit?: (artist: Omit<Artist, "id" | "created_at">) => void
}

export function ArtistRegistrationForm({ onSubmit }: ArtistRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    wallet_address: "",
    bio: "",
    photo_hash: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Artist name is required"
    }

    if (!formData.wallet_address.trim()) {
      newErrors.wallet_address = "Wallet address is required"
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.wallet_address)) {
      newErrors.wallet_address = "Invalid Ethereum wallet address format"
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Static success for now
    setIsSuccess(true)
    setIsSubmitting(false)

    if (onSubmit) {
      onSubmit(formData)
    }

    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({ name: "", wallet_address: "", bio: "", photo_hash: "" })
    }, 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto bg-card/50 border-neon-green/40 glow-green">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-neon-green mx-auto" />
            <h3 className="text-2xl font-bold text-neon-green">Registration Successful!</h3>
            <p className="text-muted-foreground">
              Welcome to CyberBeats! Your artist profile has been created and is ready for blockchain integration.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto bg-card/50 border-cyber-purple/20">
      <CardHeader>
        <CardTitle className="text-2xl text-cyber-purple flex items-center gap-2">
          <User className="h-6 w-6" />
          Artist Registration
        </CardTitle>
        <CardDescription>
          Join the decentralized music revolution. Register as an artist to start uploading and monetizing your music.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Artist Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your artist name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`bg-input/50 border-border focus:border-cyber-purple ${
                errors.name ? "border-destructive" : ""
              }`}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet_address" className="text-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet Address *
            </Label>
            <Input
              id="wallet_address"
              type="text"
              placeholder="0x..."
              value={formData.wallet_address}
              onChange={(e) => handleInputChange("wallet_address", e.target.value)}
              className={`bg-input/50 border-border focus:border-cyber-purple font-mono ${
                errors.wallet_address ? "border-destructive" : ""
              }`}
            />
            {errors.wallet_address && <p className="text-sm text-destructive">{errors.wallet_address}</p>}
            <p className="text-xs text-muted-foreground">This wallet will receive payments from your music streams</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-foreground">
              Bio (Optional)
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell your fans about yourself..."
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className={`bg-input/50 border-border focus:border-cyber-purple min-h-[100px] ${
                errors.bio ? "border-destructive" : ""
              }`}
              maxLength={500}
            />
            {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
            <p className="text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo" className="text-foreground flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Profile Photo (Optional)
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-input/20">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Photo upload will be available after blockchain integration
              </p>
              <p className="text-xs text-muted-foreground mt-1">IPFS storage coming soon</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyber-purple hover:bg-cyber-purple/80 glow-purple"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registering Artist...
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" />
                Register as Artist
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>By registering, you agree to our terms of service and privacy policy.</p>
            <p className="mt-1">Smart contract integration will be available soon.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
