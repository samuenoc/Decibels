"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Coins, TrendingUp, Music, Users, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import type { Song } from "@/lib/types"

// Mock data for artist
const mockArtistSongs: Song[] = [
  {
    id: 10,
    title: "Neon Dreams",
    artist_id: 10,
    artist_name: "CyberSynth",
    artist_wallet: "0xcadb505909332A4190aa82b12F09Ff3572aABb55",
    price: 0.001,
    duration: 245,
    plays: 15420,
    created_at: new Date("2024-01-15"),
    isPurchased: false,
  },
  {
    id: 11,
    title: "Electric Pulse",
    artist_id: 11,
    artist_name: "CyberSynth",
    artist_wallet: "0xcadb505909332A4190aa82b12F09Ff3572aABb55",
    price: 0.0008,
    duration: 312,
    plays: 23100,
    created_at: new Date("2024-01-10"),
    isPurchased: false,
  },
]

const mockEarnings = [
  { date: "2024-01-01", amount: 45.67, plays: 1250 },
  { date: "2024-01-02", amount: 52.34, plays: 1430 },
  { date: "2024-01-03", amount: 38.91, plays: 1067 },
  { date: "2024-01-04", amount: 61.23, plays: 1678 },
  { date: "2024-01-05", amount: 47.89, plays: 1312 },
]

export function ArtistDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  const totalEarnings = 2847.56
  const totalPlays = mockArtistSongs.reduce((sum, song) => sum + song.plays, 0)
  const totalSongs = mockArtistSongs.length
  const monthlyGrowth = 23.5

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`
    return plays.toString()
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-neon-green/20 glow-green">
          <CardHeader className="pb-3">
            <CardTitle className="text-neon-green flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Ganancias Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neon-green">{formatCurrency(totalEarnings)}</div>
            <p className="text-sm text-muted-foreground">+{monthlyGrowth}% este mes</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-cyber-purple/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyber-purple flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Total de reproducciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-purple">{formatPlays(totalPlays)}</div>
            <p className="text-sm text-muted-foreground">En todas las canciones</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-cyber-pink/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyber-pink flex items-center gap-2">
              <Music className="h-5 w-5" />
              Canciones lanzadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-pink">{totalSongs}</div>
            <p className="text-sm text-muted-foreground">Canciones publicadas</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-electric-blue/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-electric-blue flex items-center gap-2">
              <Users className="h-5 w-5" />
              Oyentes mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-electric-blue">2.4K</div>
            <p className="text-sm text-muted-foreground">Oyentes únicos</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card/30 border-border/50">
        <CardHeader>
          <CardTitle className="text-cyber-purple">Quick Actions</CardTitle>
          <CardDescription>Manage your music and earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Link href="/artist/upload">
              <Button className="bg-cyber-pink hover:bg-cyber-pink/80 glow-pink">
                <Music className="h-4 w-4 mr-2" />
                Upload New Song
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black bg-transparent"
            >
              <Coins className="h-4 w-4 mr-2" />
              Withdraw Earnings
            </Button>
            <Button
              variant="outline"
              className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-black bg-transparent"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Earnings */}
      <Card className="bg-card/50 border-neon-green/20">
        <CardHeader>
          <CardTitle className="text-neon-green flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Ganancias recientes
          </CardTitle>
          <CardDescription>Tus ingresos más recientes por streaming</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEarnings.map((earning, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{new Date(earning.date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">{earning.plays} plays</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neon-green">{formatCurrency(earning.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    ${(earning.amount / earning.plays).toFixed(4)} per play
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Song Performance */}
      <Card className="bg-card/50 border-cyber-purple/20">
        <CardHeader>
          <CardTitle className="text-cyber-purple flex items-center gap-2">
            <Music className="h-5 w-5" />
            Song Performance
          </CardTitle>
          <CardDescription>How your tracks are performing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockArtistSongs.map((song) => {
              const maxPlays = Math.max(...mockArtistSongs.map((s) => s.plays))
              const percentage = (song.plays / maxPlays) * 100
              const estimatedEarnings = song.plays * 0.003 // $0.003 per play

              return (
                <div key={song.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{song.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPlays(song.plays)} plays • {formatCurrency(estimatedEarnings)} earned
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Status */}
      <Card className="bg-card/30 border-electric-blue/20">
        <CardHeader>
          <CardTitle className="text-electric-blue">Blockchain Integration Status</CardTitle>
          <CardDescription>Smart contract and payment setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
              <span>Wallet Connected</span>
              <span className="text-neon-green font-semibold">✓ Ready</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
              <span>Smart Contracts</span>
              <span className="text-yellow-500 font-semibold">⏳ Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
              <span>Automatic Payouts</span>
              <span className="text-yellow-500 font-semibold">⏳ Coming Soon</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
