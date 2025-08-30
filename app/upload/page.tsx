"use client"

import { SongUploadForm } from "@/components/forms/song-upload-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Shield, Zap, Globe } from "lucide-react"
import { ValidationModal } from "@/components/auth/validation-modal"
import { useValidation } from "@/hooks/use-validation"
import { useAuth } from "@/components/auth/auth-provider"

export default function UploadPage() {
  const { showValidationModal, closeValidationModal, handleValidationSuccess, validateAccess } = useValidation()
  const { isAuthenticated, isWalletConnected } = useAuth()

  // Check if user is authenticated and has wallet connected
  if (!isAuthenticated || !isWalletConnected) {
    return (
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance">
            <span className="text-cyber-pink">Upload</span> <span className="text-cyber-purple">Your Music</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Share your creativity with the world. Upload your tracks and start earning from every stream through
            decentralized technology.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-card/30 border-border/50">
          <CardContent className="p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">
              Please connect your wallet and create an account to upload music.
            </p>
            <button
              onClick={() => validateAccess()}
              className="bg-cyber-pink hover:bg-cyber-pink/80 text-black px-6 py-2 rounded-md font-medium glow-pink"
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

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance">
          <span className="text-cyber-pink">Upload</span> <span className="text-cyber-purple">Your Music</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Share your creativity with the world. Upload your tracks and start earning from every stream through
          decentralized technology.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
          <Upload className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
          <h3 className="font-semibold text-cyber-pink">Easy Upload</h3>
          <p className="text-sm text-muted-foreground">Drag & drop your files for instant upload</p>
        </Card>

        <Card className="bg-card/30 border-cyber-purple/20 text-center p-4">
          <Shield className="h-8 w-8 text-cyber-purple mx-auto mb-2" />
          <h3 className="font-semibold text-cyber-purple">IPFS Storage</h3>
          <p className="text-sm text-muted-foreground">Decentralized storage ensures permanence</p>
        </Card>

        <Card className="bg-card/30 border-electric-blue/20 text-center p-4">
          <Zap className="h-8 w-8 text-electric-blue mx-auto mb-2" />
          <h3 className="font-semibold text-electric-blue">Instant Live</h3>
          <p className="text-sm text-muted-foreground">Your music goes live immediately</p>
        </Card>

        <Card className="bg-card/30 border-neon-green/20 text-center p-4">
          <Globe className="h-8 w-8 text-neon-green mx-auto mb-2" />
          <h3 className="font-semibold text-neon-green">Global Access</h3>
          <p className="text-sm text-muted-foreground">Reach listeners worldwide instantly</p>
        </Card>
      </div>

      {/* Upload Form */}
      <SongUploadForm />

      {/* Technical Details */}
      <Card className="max-w-2xl mx-auto bg-card/30 border-border/50">
        <CardHeader>
          <CardTitle className="text-center text-cyber-purple">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-cyber-pink text-black text-sm flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">File Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Your audio file is processed and optimized for streaming
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-cyber-purple text-black text-sm flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">IPFS Upload</h4>
                <p className="text-sm text-muted-foreground">
                  File is stored on IPFS for decentralized, permanent access
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-electric-blue text-black text-sm flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Blockchain Registration</h4>
                <p className="text-sm text-muted-foreground">
                  Metadata and ownership are recorded on Arbitrum blockchain
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-neon-green text-black text-sm flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold">Go Live</h4>
                <p className="text-sm text-muted-foreground">Your music is instantly available for streaming</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
