"use client"

import { useState, useEffect } from "react"

export type UserMode = "listener" | "artist"

export interface UserModeContextType {
    userMode: UserMode
    setUserMode: (mode: UserMode) => void
    toggleUserMode: () => void
}

export function useUserModeProvider() {
    const [userMode, setUserMode] = useState<UserMode>("listener")

    const toggleUserMode = () => {
        setUserMode(prev => prev === "listener" ? "artist" : "listener")
    }

    useEffect(() => {
        // Load user mode from localStorage
        const savedMode = localStorage.getItem("cyberbeats_user_mode")
        if (savedMode && (savedMode === "listener" || savedMode === "artist")) {
            setUserMode(savedMode as UserMode)
        }
    }, [])

    useEffect(() => {
        // Save user mode to localStorage
        localStorage.setItem("cyberbeats_user_mode", userMode)
    }, [userMode])

    return {
        userMode,
        setUserMode,
        toggleUserMode
    }
}
