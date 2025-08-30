"use client"

import { ListenerDashboard } from "@/components/dashboard/listener-dashboard"

export default function ListenerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance">
          <span className="text-cyber-purple">Listener</span> <span className="text-cyber-purple">Dashboard</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Track your listening habits, discover new music, and manage your favorites.
        </p>
      </div>

      {/* Dashboard Content */}
      <ListenerDashboard />
    </div>
  )
}