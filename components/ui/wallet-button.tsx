"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

interface WalletButtonProps {
    className?: string
}

export function WalletButton({ className }: WalletButtonProps) {
    const { user, isWalletConnected, connectWallet, disconnectWallet } = useAuth()
    const [copied, setCopied] = useState(false)

    const handleConnectWallet = async () => {
        try {
            // Check if MetaMask is installed
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

    const handleDisconnectWallet = () => {
        disconnectWallet()
        toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected.",
        })
    }

    const copyAddress = async () => {
        if (user?.walletAddress) {
            await navigator.clipboard.writeText(user.walletAddress)
            setCopied(true)
            toast({
                title: "Address Copied",
                description: "Wallet address copied to clipboard!",
            })
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    if (isWalletConnected && user?.walletAddress) {
        return (
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black glow-green bg-transparent"
                    onClick={copyAddress}
                >
                    <Wallet className="h-4 w-4 mr-2" />
                    {formatAddress(user.walletAddress)}
                    {copied ? (
                        <Check className="h-4 w-4 ml-2" />
                    ) : (
                        <Copy className="h-4 w-4 ml-2" />
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:text-red-400"
                    onClick={handleDisconnectWallet}
                >
                    Disconnect
                </Button>
            </div>
        )
    }

    return (
        <Button
            variant="outline"
            className={`border-neon-green text-neon-green hover:bg-neon-green hover:text-black glow-green bg-transparent ${className}`}
            onClick={handleConnectWallet}
        >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
        </Button>
    )
}
