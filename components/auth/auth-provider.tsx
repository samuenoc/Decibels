"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface User {
    id: string
    email: string
    username: string
    role: "listener" | "artist"
    walletAddress?: string
    isRegistered: boolean
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isWalletConnected: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<boolean>
    register: (userData: Omit<User, "id" | "isRegistered">) => Promise<boolean>
    logout: () => void
    connectWallet: (address: string) => void
    disconnectWallet: () => void
    checkAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isWalletConnected, setIsWalletConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const isAuthenticated = user !== null && user.isRegistered

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true)
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock user data - in real app this would come from your backend
            const mockUser: User = {
                id: "user_1",
                email,
                username: email.split("@")[0],
                role: "listener",
                isRegistered: true,
                walletAddress: isWalletConnected ? "0x1234...5678" : undefined
            }

            setUser(mockUser)
            return true
        } catch (error) {
            console.error("Login failed:", error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (userData: Omit<User, "id" | "isRegistered">): Promise<boolean> => {
        try {
            setIsLoading(true)
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            const newUser: User = {
                id: `user_${Date.now()}`,
                ...userData,
                isRegistered: true,
                walletAddress: isWalletConnected ? "0x1234...5678" : undefined
            }

            setUser(newUser)
            return true
        } catch (error) {
            console.error("Registration failed:", error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        setIsWalletConnected(false)
        // Clear from localStorage
        localStorage.removeItem("cyberbeats_user")
        localStorage.removeItem("cyberbeats_wallet")
    }

    const connectWallet = (address: string) => {
        setIsWalletConnected(true)
        if (user) {
            setUser({ ...user, walletAddress: address })
        }
        localStorage.setItem("cyberbeats_wallet", address)
    }

    const disconnectWallet = () => {
        setIsWalletConnected(false)
        if (user) {
            setUser({ ...user, walletAddress: undefined })
        }
        localStorage.removeItem("cyberbeats_wallet")
    }

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true)

            // Check localStorage for existing session
            const savedUser = localStorage.getItem("cyberbeats_user")
            const savedWallet = localStorage.getItem("cyberbeats_wallet")

            if (savedUser) {
                const userData = JSON.parse(savedUser)
                setUser(userData)
            }

            if (savedWallet) {
                setIsWalletConnected(true)
            }

        } catch (error) {
            console.error("Auth check failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        checkAuthStatus()
    }, [])

    useEffect(() => {
        // Save user to localStorage when it changes
        if (user) {
            localStorage.setItem("cyberbeats_user", JSON.stringify(user))
        }
    }, [user])

    const authValue: AuthContextType = {
        user,
        isAuthenticated,
        isWalletConnected,
        isLoading,
        login,
        register,
        logout,
        connectWallet,
        disconnectWallet,
        checkAuthStatus
    }

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    )
}
