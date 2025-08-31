"use client"

// Extend Window interface to include 'rabby'
declare global {
  interface Window {
    rabby?: any
  }
}

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Music, User, Upload, BarChart3, LogOut, Mic, Menu, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function Navigation() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<"listener" | "artist" | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Check localStorage on component mount and when storage changes
  useEffect(() => {
    const updateAuthState = () => {
      const authStatus = localStorage.getItem('isAuthenticated')
      const storedUserType = localStorage.getItem('userType') as 'listener' | 'artist' | null
      const storedUserEmail = localStorage.getItem('userEmail')
      
      setIsAuthenticated(authStatus === 'true')
      setUserType(storedUserType)
      setUserEmail(storedUserEmail)
    }

    // Initial check
    updateAuthState()

    // Listen for storage changes (when localStorage is updated)
    window.addEventListener('storage', updateAuthState)
    
    // Custom event listener for same-tab localStorage changes
    const handleAuthChange = () => updateAuthState()
    window.addEventListener('authStateChanged', handleAuthChange)

    return () => {
      window.removeEventListener('storage', updateAuthState)
      window.removeEventListener('authStateChanged', handleAuthChange)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userType')
      localStorage.removeItem('userEmail')
      
      // Update local state
      setIsAuthenticated(false)
      setUserType(null)
      setUserEmail(null)
      
      // Disconnect from Rabby wallet
      if (typeof window !== 'undefined' && window.rabby) {
        try {
          await window.rabby.request({
            method: 'wallet_disconnect'
          })
        } catch (error) {
          console.log('Wallet disconnect failed:', error)
        }
      }
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      })
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      toast({
        title: "Error al cerrar sesión",
        description: "Ocurrió un error al cerrar la sesión.",
        variant: "destructive",
      })
    }
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-8 w-8 text-cyber-purple" />
            <span className="text-2xl font-bold text-cyber-purple">DeciBels</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/songs">
              <Button variant="ghost" className="text-foreground hover:text-cyber-purple">
                Canciones
              </Button>
            </Link>

            {isAuthenticated && (
              <>
                {userType === "artist" && (
                  <Link href="/artist/upload">
                    <Button variant="ghost" className="text-foreground hover:text-cyber-pink">
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="hidden lg:inline">Subir Cancion</span>
                    </Button>
                  </Link>
                )}
                <Link href={userType === "artist" ? "/artist/dashboard" : "/listener/dashboard"}>
                  <Button
                    variant="outline"
                    className={`${userType === "artist"
                      ? "border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black glow-pink"
                      : "border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black glow-purple"
                      } bg-transparent`}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Button>
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden lg:inline">
                  Bienvenido, {userEmail?.split('@')[0]}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-foreground hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/listener/register">
                  <Button
                    variant="outline"
                    className="border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black glow-purple bg-transparent"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col gap-2 pt-4">
              <Link href="/songs" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-cyber-purple">
                  <Music className="h-4 w-4 mr-2" />
                  Canciones
                </Button>
              </Link>

              {isAuthenticated && (
                <>
                  {userType === "artist" && (
                    <Link href="/artist/upload" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-foreground hover:text-cyber-pink">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Cancion
                      </Button>
                    </Link>
                  )}
                  <Link href={userType === "artist" ? "/artist/dashboard" : "/listener/dashboard"} onClick={closeMobileMenu}>
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${userType === "artist"
                        ? "border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black glow-pink"
                        : "border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black glow-purple"
                        } bg-transparent`}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center justify-between w-full px-3 py-2">
                    <span className="text-sm text-muted-foreground">
                      Welcome, {userEmail?.split('@')[0]}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout()
                        closeMobileMenu()
                      }}
                      className="text-foreground hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <Link href="/listener/register" onClick={closeMobileMenu}>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black glow-purple bg-transparent"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}