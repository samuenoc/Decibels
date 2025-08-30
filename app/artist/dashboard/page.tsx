"use client"

import { ArtistDashboard } from "@/components/dashboard/artist-dashboard"

export default function ArtistDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance">
          <span className="text-cyber-pink">Artist</span> <span className="text-cyber-pink">Dashboard</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Monitor your music performance, track earnings, and manage your releases.
        </p>
      </div>

      {/* Dashboard Content */}
      <ArtistDashboard />
    </div>
  )
}