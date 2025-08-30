"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mic, Loader2 } from "lucide-react"
import { ValidationModal } from "@/components/auth/validation-modal"
import { useValidation } from "@/hooks/use-validation"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isWalletConnected, user } = useAuth()
  const { showValidationModal, closeValidationModal, handleValidationSuccess, validateAccess } = useValidation()

  // Redirect based on user role
  useEffect(() => {
    if (isAuthenticated && isWalletConnected && user) {
      if (user.role === "listener") {
        router.push("/listener/dashboard")
      } else if (user.role === "artist") {
        router.push("/artist/dashboard")
      }
    }
  }, [isAuthenticated, isWalletConnected, user, router])

  // Show loading while checking authentication
  if (isAuthenticated && isWalletConnected && user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-cyber-purple" />
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show access required message
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance">
          <span className="text-cyber-purple">Your</span> <span className="text-cyber-pink">Dashboard</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Connect your wallet and create an account to access your personalized dashboard.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto bg-card/30 border-border/50">
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground mb-4">
            Please connect your wallet and create an account to access your dashboard.
          </p>
          <button
            onClick={() => validateAccess()}
            className="bg-cyber-purple hover:bg-cyber-purple/80 text-black px-6 py-2 rounded-md font-medium glow-purple"
          >
            Connect Wallet & Register
          </button>
        </CardContent>
      </Card>

      <ValidationModal
        isOpen={showValidationModal}
        onClose={closeValidationModal}
        onSuccess={handleValidationSuccess}
      />
    </div>
  )
}
