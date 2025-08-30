"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music, User, Upload, BarChart3, LogOut, Mic, Menu, X } from "lucide-react"
import { WalletButton } from "@/components/ui/wallet-button"
import { useAuth } from "@/components/auth/auth-provider"
import { useUserMode } from "@/components/providers/user-mode-provider"

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth()
  const { userMode } = useUserMode()
  const [userRole, setUserRole] = useState<"listener" | "artist">(user?.role || "listener")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
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
                Songs
              </Button>
            </Link>

            {isAuthenticated && (
              <>
                {user?.role === "artist" && (
                  <Link href="/artist/upload">
                    <Button variant="ghost" className="text-foreground hover:text-cyber-pink">
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="hidden lg:inline">Upload</span>
                    </Button>
                  </Link>
                )}
                <Link href={user?.role === "artist" ? "/artist/dashboard" : "/listener/dashboard"}>
                  <Button
                    variant="outline"
                    className={`${user?.role === "artist"
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
                  Welcome, {user?.username}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-foreground hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href={userMode === "listener" ? "/listener/register" : "/artist/register"}>
                <Button
                  variant="outline"
                  className={
                    userMode === "listener"
                      ? "border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black glow-purple bg-transparent"
                      : "border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black glow-pink bg-transparent"
                  }
                >
                  {userMode === "listener" ? (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Join as Listener</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Become Artist</span>
                    </>
                  )}
                </Button>
              </Link>
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
                  Songs
                </Button>
              </Link>

              {isAuthenticated && (
                <>
                  {user?.role === "artist" && (
                    <Link href="/artist/upload" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-foreground hover:text-cyber-pink">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </Link>
                  )}
                  <Link href={user?.role === "artist" ? "/artist/dashboard" : "/listener/dashboard"} onClick={closeMobileMenu}>
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${user?.role === "artist"
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
                      Welcome, {user?.username}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout()
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
                <Link href={userMode === "listener" ? "/listener/register" : "/artist/register"} onClick={closeMobileMenu}>
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${userMode === "listener"
                      ? "border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black glow-purple bg-transparent"
                      : "border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black glow-pink bg-transparent"
                      }`}
                  >
                    {userMode === "listener" ? (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Join as Listener
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Become Artist
                      </>
                    )}
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