"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music, User, Upload, BarChart3 } from "lucide-react"

export function Navigation() {
  const [userRole, setUserRole] = useState<"listener" | "artist">("listener")

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-8 w-8 text-cyber-purple" />
            <span className="text-2xl font-bold text-cyber-purple">CyberBeats</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/songs">
              <Button variant="ghost" className="text-foreground hover:text-cyber-purple">
                Songs
              </Button>
            </Link>

            {userRole === "artist" && (
              <>
                <Link href="/upload">
                  <Button variant="ghost" className="text-foreground hover:text-cyber-pink">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-foreground hover:text-electric-blue">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </>
            )}

            <Link href="/register">
              <Button
                variant="outline"
                className="border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black glow-purple bg-transparent"
              >
                <User className="h-4 w-4 mr-2" />
                {userRole === "listener" ? "Become Artist" : "Profile"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
