"use client"

import { createContext, useContext, ReactNode } from "react"
import { useUserModeProvider, UserModeContextType } from "@/hooks/use-user-mode"

const UserModeContext = createContext<UserModeContextType | undefined>(undefined)

interface UserModeProviderProps {
    children: ReactNode
}

export function useUserMode() {
    const context = useContext(UserModeContext)
    if (context === undefined) {
        throw new Error("useUserMode must be used within a UserModeProvider")
    }
    return context
}

export function UserModeProvider({ children }: UserModeProviderProps) {
    const userMode = useUserModeProvider()

    return (
        <UserModeContext.Provider value={userMode}>
            {children}
        </UserModeContext.Provider>
    )
}
