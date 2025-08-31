"use client"

import { Button } from "@/components/ui/button"
import { User, Music } from "lucide-react"
import { useUserMode } from "@/components/providers/user-mode-provider"

export function ModeToggle() {
    const { userMode, toggleUserMode } = useUserMode()

    return (
        <div className="flex items-center gap-2 bg-card/30 border border-border rounded-lg p-1">
            <Button
                variant={userMode === "listener" ? "default" : "ghost"}
                size="sm"
                onClick={() => toggleUserMode()}
                className={
                    userMode === "listener"
                        ? "bg-cyber-purple hover:bg-cyber-purple/80 text-black"
                        : "text-muted-foreground hover:text-foreground"
                }
            >
                <User className="h-4 w-4 mr-2" />
                Listener
            </Button>
            <Button
                variant={userMode === "artist" ? "default" : "ghost"}
                size="sm"
                onClick={() => toggleUserMode()}
                className={
                    userMode === "artist"
                        ? "bg-cyber-pink hover:bg-cyber-pink/80 text-black"
                        : "text-muted-foreground hover:text-foreground"
                }
            >
                <Music className="h-4 w-4 mr-2" />
                Artista
            </Button>
        </div>
    )
}
