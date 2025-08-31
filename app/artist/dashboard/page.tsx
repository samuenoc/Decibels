"use client"

import { ArtistDashboard } from "@/components/dashboard/artist-dashboard"

export default function ArtistDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance">
          <span className="text-cyber-pink">Panel de control del</span> <span className="text-cyber-pink">Artista</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Monitorea tu desempeño musical, lleva un registro de tus ganancias y administra tus lanzamientos.
        </p>
      </div>

      {/* Dashboard Content */}
      <ArtistDashboard />
    </div>
  )
}