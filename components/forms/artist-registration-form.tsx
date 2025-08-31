"use client"

// Extend the Window interface to include 'rabby'
declare global {
  interface Window {
    rabby?: any
    ethereum?: any
  }
}

import Link from "next/link"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Lock, Music, Wallet, Mic } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "@/hooks/use-toast"

export function ArtistRegistrationForm() {
  const { register, isWalletConnected, connectWallet } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isAccountCreated, setIsAccountCreated] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    artistName: "",
    bio: "",
    genre: ""
  })

  const handleWalletConnect = async () => {
    try {
      if (typeof window.rabby !== "undefined") {
        const accounts = await window.rabby.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          const address = accounts[0]
          connectWallet(address)
          toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected!",
          })
        }
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Por favor instala la wallet de Rabby para continuar y conectar",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Conexión fallida",
        description: "Fallo al conectar a la wallet, intenta de nuevo",
        variant: "destructive",
      })
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (!formData.artistName.trim()) {
      toast({
        title: "Artist Name Required",
        description: "Please enter your artist name.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await register({
        email: formData.email,
        username: formData.username,
        role: "artist",
      })

      if (success) {
        setIsAccountCreated(true)
        toast({
          title: "Account Created",
          description: "Your artist account has been created successfully!",
        })
      } else {
        toast({
          title: "Registration Failed",
          description: "Failed to create artist account. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectWallet = async () => {
    if (!isAccountCreated) {
      toast({
        title: "Account Required",
        description: "Please create your account first.",
        variant: "destructive",
      })
      return
    }

    try {
      if (typeof window.rabby !== "undefined") {
        const accounts = await window.rabby.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          const address = accounts[0]
          connectWallet(address)
          toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected!",
          })

        }
      } else {
        toast({
          title: "Rabby Not Found",
          description: "Please install Rabby to connect your wallet.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="max-w-md mx-auto bg-card/30 border-cyber-pink/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-cyber-pink rounded-full flex items-center justify-center">
          <Mic className="h-6 w-6 text-black" />
        </div>
        <CardTitle className="text-2xl font-bold text-cyber-pink">
          Join as Artist
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Create your artist account to upload and monetize your music
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Account Creation Section */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-2">Step 1: Create Artist Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Fill in your details to create an artist account
            </p>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-input/50 border-border focus:border-cyber-pink"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Choose a username"
                required
                className="bg-input/50 border-border focus:border-cyber-pink"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artistName">Artist Name</Label>
              <Input
                id="artistName"
                type="text"
                value={formData.artistName}
                onChange={(e) => handleInputChange("artistName", e.target.value)}
                placeholder="Your artist/stage name"
                required
                className="bg-input/50 border-border focus:border-cyber-pink"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Primary Genre</Label>
              <Input
                id="genre"
                type="text"
                value={formData.genre}
                onChange={(e) => handleInputChange("genre", e.target.value)}
                placeholder="e.g., Electronic, Rock, Hip-Hop"
                className="bg-input/50 border-border focus:border-cyber-pink"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Artist Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about your music and style..."
                rows={3}
                className="bg-input/50 border-border focus:border-cyber-pink"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Create a password"
                required
                className="bg-input/50 border-border focus:border-cyber-pink"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                required
                className="bg-input/50 border-border focus:border-cyber-pink"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyber-pink hover:bg-cyber-pink/80 glow-pink"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Artist Account...
                </div>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Create Artist Account
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Wallet Connection Section */}
        {/* Wallet Connection Section */}
        {isAccountCreated && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">Step 2: Connect Wallet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your MetaMask wallet to complete registration
              </p>
            </div>

            <Button
              onClick={handleConnectWallet}
              disabled={isWalletConnected}
              className={`w-full ${isWalletConnected
                ? "bg-neon-green text-black cursor-not-allowed"
                : "bg-cyber-pink hover:bg-cyber-pink/80 glow-pink"
                }`}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isWalletConnected ? "Wallet Connected" : "Conectar a Rabby"}
            </Button>

            <div className="text-center mt-4">
              <Link href="/artist/dashboard" className="text-cyber-pink underline hover:text-cyber-pink/80">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
