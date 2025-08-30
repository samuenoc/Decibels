"use client"

import { useState } from "react"
import { ListenerDashboard } from "@/components/dashboard/listener-dashboard"
import { ArtistDashboard } from "@/components/dashboard/artist-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Music } from "lucide-react"

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<"listener" | "artist">("listener")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance">
          <span className="text-cyber-purple">Your</span> <span className="text-cyber-pink">Dashboard</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          {userRole === "listener"
            ? "Track your listening habits and discover new music"
            : "Monitor your music performance and earnings"}
        </p>
      </div>

      {/* Role Switcher */}
      <Card className="max-w-md mx-auto bg-card/30 border-border/50">
        <CardHeader className="text-center">
          <CardTitle>Switch View</CardTitle>
          <CardDescription>Toggle between listener and artist dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={userRole === "listener" ? "default" : "outline"}
              onClick={() => setUserRole("listener")}
              className={`flex-1 ${
                userRole === "listener"
                  ? "bg-cyber-purple hover:bg-cyber-purple/80"
                  : "border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black"
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Listener
            </Button>
            <Button
              variant={userRole === "artist" ? "default" : "outline"}
              onClick={() => setUserRole("artist")}
              className={`flex-1 ${
                userRole === "artist"
                  ? "bg-cyber-pink hover:bg-cyber-pink/80"
                  : "border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black"
              }`}
            >
              <Music className="h-4 w-4 mr-2" />
              Artist
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Content */}
      {userRole === "listener" ? <ListenerDashboard /> : <ArtistDashboard />}
    </div>
  )
}
