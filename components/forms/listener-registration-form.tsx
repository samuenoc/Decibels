"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock, Music, Wallet } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "@/hooks/use-toast"

export function ListenerRegistrationForm() {
  const { register, isWalletConnected, connectWallet } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isAccountCreated, setIsAccountCreated] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleWalletConnect = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
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
          description: "Please install MetaMask to connect your wallet.",
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

    setIsLoading(true)
    try {
      const success = await register({
        email: formData.email,
        username: formData.email.split("@")[0], // Use email prefix as username
        role: "listener",
      })

      if (success) {
        setIsAccountCreated(true)
        toast({
          title: "Account Created",
          description: "Your listener account has been created successfully!",
        })
      } else {
        toast({
          title: "Registration Failed",
          description: "Failed to create account. Please try again.",
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
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
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
          description: "Please install MetaMask to connect your wallet.",
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
    <Card className="max-w-md mx-auto bg-card/30 border-cyber-purple/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-cyber-purple rounded-full flex items-center justify-center">
          <Music className="h-6 w-6 text-black" />
        </div>
        <CardTitle className="text-2xl font-bold text-cyber-purple">
          Join as Listener
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Create your listener account to start enjoying music
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Account Creation Section */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-2">Step 1: Create Listener Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Fill in your details to create a listener account
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
                className="bg-input/50 border-border focus:border-cyber-purple"
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
                className="bg-input/50 border-border focus:border-cyber-purple"
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
                className="bg-input/50 border-border focus:border-cyber-purple"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyber-purple hover:bg-cyber-purple/80 glow-purple"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Listener Account...
                </div>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Create Listener Account
                </>
              )}
            </Button>
          </form>
        </div>

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
                : "bg-cyber-purple hover:bg-cyber-purple/80 glow-purple"
                }`}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isWalletConnected ? "Wallet Connected" : "Connect MetaMask"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
