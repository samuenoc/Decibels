"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SongCard } from "@/components/music/song-card"
import { usePlayback } from "@/hooks/use-playback"
import { Music, Heart, Clock, TrendingUp, Wallet, RefreshCw } from "lucide-react"
import type { Song } from "@/lib/types"
import { useWeb3 } from "@/hooks/web3";

// Mock data for listener
const mockRecentlyPlayed: Song[] = [
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
    id: "song_3",
    title: "Electric Pulse",
    artist_id: "artist_1",
    artist_name: "CyberSynth",
    duration: 312,
    plays: 23100,
    created_at: new Date("2024-01-10"),
  },
]

const mockFavorites: Song[] = [
  {
    id: "song_2",
    title: "Digital Horizon",
    artist_id: "artist_2",
    artist_name: "NeonBeats",
    duration: 198,
    plays: 8750,
    created_at: new Date("2024-01-20"),
  },
]

const mockRecommended: Song[] = [
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

// Types para Rabby Wallet
interface WalletBalance {
  balance: string
  address: string
  isConnected: boolean
}

export function ListenerDashboard() {
  const [activeTab, setActiveTab] = useState<"recent" | "favorites" | "recommended">("recent")
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    balance: "0",
    address: "",
    isConnected: false
  })

  const {
          balance,
          isLoading,
          error,
          walletAddress,
          contractAddress,
          refreshBalance,
          getContractInfo
      } = useWeb3();
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const playback = usePlayback([...mockRecentlyPlayed, ...mockFavorites, ...mockRecommended])

  const totalListeningTime = 1247 // minutes
  const songsPlayed = 156
  const favoriteArtists = 12

  // Función para conectar y obtener balance de Rabby
  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.rabby) {
      console.error('Rabby wallet not found')
      return
    }

    setIsLoadingWallet(true)
    try {
      // Solicitar conexión a la wallet
      const accounts = await window.rabby.request({
        method: 'eth_requestAccounts'
      })

      if (accounts && accounts.length > 0) {
        const address = accounts[0]

        // Obtener balance
        const balance = await window.rabby.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        })

        // Convertir de wei a ETH
        const balanceInEth = parseFloat(balance) / Math.pow(10, 18)

        setWalletBalance({
          balance: balanceInEth.toFixed(4),
          address: address,
          isConnected: true
        })
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error)
    } finally {
      setIsLoadingWallet(false)
    }
  }

  // Función para refrescar balance
  const refreshWalletBalance = async () => {
    if (!walletBalance.isConnected || !walletBalance.address) return

    setIsLoadingWallet(true)
    try {
      const balance = await window.rabby.request({
        method: 'eth_getBalance',
        params: [walletBalance.address, 'latest']
      })

      const balanceInEth = parseFloat(balance) / Math.pow(10, 18)
      setWalletBalance(prev => ({
        ...prev,
        balance: balanceInEth.toFixed(4)
      }))
    } catch (error) {
      console.error('Error refreshing balance:', error)
    } finally {
      setIsLoadingWallet(false)
    }
  }

  // Verificar conexión existente al cargar
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.rabby) {
        try {
          const accounts = await window.rabby.request({
            method: 'eth_accounts'
          })

          if (accounts && accounts.length > 0) {
            const address = accounts[0]
            const balance = await window.rabby.request({
              method: 'eth_getBalance',
              params: [address, 'latest']
            })

            const balanceInEth = parseFloat(balance) / Math.pow(10, 18)
            setWalletBalance({
              balance: balanceInEth.toFixed(4),
              address: address,
              isConnected: true
            })
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error)
        }
      }
    }

    checkConnection()
  }, [])

  const getCurrentSongs = () => {
    switch (activeTab) {
      case "recent":
        return mockRecentlyPlayed
      case "favorites":
        return mockFavorites
      case "recommended":
        return mockRecommended
      default:
        return mockRecentlyPlayed
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="space-y-8">
      {/* Wallet Balance Card - Positioned at top right or as first card */}
      {walletBalance.isConnected && (
        <Card className="bg-gradient-to-r from-cyber-purple/10 to-electric-blue/10 border-cyber-purple/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyber-purple flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Balance
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshWalletBalance}
                disabled={isLoadingWallet}
                className="h-8 w-8 p-0 text-cyber-purple hover:bg-cyber-purple/10"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingWallet ? 'animate-spin' : ''}`} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyber-purple mb-1">
              {balance} ETH
            </div>
            <p className="text-xs text-muted-foreground">
              {formatAddress(walletBalance.address)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Connect Wallet Button - Only show if not connected */}
      {!walletBalance.isConnected && (
        <Card className="bg-card/30 border-cyber-purple/20">
          <CardContent className="p-6 text-center">
            <Wallet className="h-8 w-8 text-cyber-purple mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2 text-cyber-purple">Connect Your Wallet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your Rabby wallet to see your balance and unlock more features
            </p>
            <Button
              onClick={connectWallet}
              disabled={isLoadingWallet}
              className="bg-cyber-purple hover:bg-cyber-purple/80"
            >
              {isLoadingWallet ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Rabby Wallet
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-cyber-purple/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyber-purple flex items-center gap-2">
              <Music className="h-5 w-5" />
              Songs Played
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-purple">{songsPlayed}</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-cyber-pink/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyber-pink flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Listening Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-pink">{Math.floor(totalListeningTime / 60)}h</div>
            <p className="text-sm text-muted-foreground">{totalListeningTime % 60}m this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-electric-blue/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-electric-blue flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Favorite Artists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-electric-blue">{favoriteArtists}</div>
            <p className="text-sm text-muted-foreground">Following</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "recent" ? "default" : "outline"}
          onClick={() => setActiveTab("recent")}
          className={
            activeTab === "recent"
              ? "bg-cyber-purple hover:bg-cyber-purple/80"
              : "border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black"
          }
        >
          <Clock className="h-4 w-4 mr-2" />
          Recently Played
        </Button>
        <Button
          variant={activeTab === "favorites" ? "default" : "outline"}
          onClick={() => setActiveTab("favorites")}
          className={
            activeTab === "favorites"
              ? "bg-cyber-pink hover:bg-cyber-pink/80"
              : "border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black"
          }
        >
          <Heart className="h-4 w-4 mr-2" />
          Favorites
        </Button>
        <Button
          variant={activeTab === "recommended" ? "default" : "outline"}
          onClick={() => setActiveTab("recommended")}
          className={
            activeTab === "recommended"
              ? "bg-electric-blue hover:bg-electric-blue/80"
              : "border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-black"
          }
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Recommended
        </Button>
      </div>

      {/* Song List */}
      <div className="space-y-4">
        {getCurrentSongs().length === 0 ? (
          <Card className="bg-card/30 border-border/50">
            <CardContent className="p-8 text-center">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No songs yet</h3>
              <p className="text-muted-foreground">
                {activeTab === "recent" && "Start listening to see your recently played songs here"}
                {activeTab === "favorites" && "Heart songs you love to add them to your favorites"}
                {activeTab === "recommended" && "We'll recommend songs based on your listening history"}
              </p>
            </CardContent>
          </Card>
        ) : (
          getCurrentSongs().map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={playback.currentSong?.id === song.id && playback.isPlaying}
              isLoading={playback.currentSong?.id === song.id && playback.isLoading}
              onPlay={playback.play}
              onPause={playback.pause}
            />
          ))
        )}
      </div>
    </div>
  )
}