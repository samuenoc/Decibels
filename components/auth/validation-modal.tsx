"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Lock, Music } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "@/hooks/use-toast"
import { ListenerRegistrationForm } from "@/components/forms/listener-registration-form"
import { ArtistRegistrationForm } from "@/components/forms/artist-registration-form"

interface ValidationModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function ValidationModal({ isOpen, onClose, onSuccess }: ValidationModalProps) {
    const { login, connectWallet, isWalletConnected } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("login")

    // Login form state
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Register form state
    const [registerRole, setRegisterRole] = useState<"listener" | "artist">("listener")

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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isWalletConnected) {
            toast({
                title: "Wallet Required",
                description: "Please connect your wallet first.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            const success = await login(loginEmail, loginPassword)
            if (success) {
                toast({
                    title: "Login Successful",
                    description: "Welcome back to CyberBeats!",
                })
                onSuccess()
                onClose()
            } else {
                toast({
                    title: "Login Failed",
                    description: "Invalid credentials. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Login Error",
                description: "An error occurred during login.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-cyber-purple/20">
                <DialogHeader className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 bg-cyber-purple rounded-full flex items-center justify-center">
                        <Music className="h-6 w-6 text-black" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-cyber-purple">
                        Access Required
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Connect your wallet and create an account to access all features
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Wallet Connection Section */}
                    <div className="space-y-4">
                        <div className="text-center">
                            <h3 className="font-semibold text-foreground mb-2">Step 1: Connect Wallet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Connect your MetaMask wallet to continue
                            </p>
                        </div>

                        <Button
                            onClick={handleWalletConnect}
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

                    {/* Authentication Section */}
                    {isWalletConnected && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <h3 className="font-semibold text-foreground mb-2">Step 2: Create Account</h3>
                                <p className="text-sm text-muted-foreground">
                                    Register or login to your account
                                </p>
                            </div>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-muted">
                                    <TabsTrigger value="login" className="data-[state=active]:bg-cyber-purple data-[state=active]:text-black">
                                        Login
                                    </TabsTrigger>
                                    <TabsTrigger value="register" className="data-[state=active]:bg-cyber-pink data-[state=active]:text-black">
                                        Register
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="login" className="space-y-4 mt-4">
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="login-email">Email</Label>
                                            <Input
                                                id="login-email"
                                                type="email"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                required
                                                className="bg-input/50 border-border focus:border-cyber-purple"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="login-password">Password</Label>
                                            <Input
                                                id="login-password"
                                                type="password"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                placeholder="Enter your password"
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
                                                    Logging in...
                                                </div>
                                            ) : (
                                                <>
                                                    <Lock className="h-4 w-4 mr-2" />
                                                    Login
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="register" className="space-y-4 mt-4">
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <h3 className="font-semibold text-foreground mb-2">Choose Your Role</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Select whether you want to join as a listener or artist
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant={registerRole === "listener" ? "default" : "outline"}
                                                onClick={() => setRegisterRole("listener")}
                                                className={
                                                    registerRole === "listener"
                                                        ? "bg-cyber-purple hover:bg-cyber-purple/80"
                                                        : "border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black"
                                                }
                                            >
                                                <User className="h-4 w-4 mr-2" />
                                                Listener
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={registerRole === "artist" ? "default" : "outline"}
                                                onClick={() => setRegisterRole("artist")}
                                                className={
                                                    registerRole === "artist"
                                                        ? "bg-cyber-pink hover:bg-cyber-pink/80"
                                                        : "border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black"
                                                }
                                            >
                                                <Music className="h-4 w-4 mr-2" />
                                                Artist
                                            </Button>
                                        </div>

                                        {registerRole === "listener" ? (
                                            <ListenerRegistrationForm />
                                        ) : (
                                            <ArtistRegistrationForm />
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
