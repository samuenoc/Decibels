import { ArtistRegistrationForm } from "@/components/forms/artist-registration-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, Coins, Music } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance">
          <span className="text-cyber-purple">Join the</span> <span className="text-cyber-pink">Revolution</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Become a verified artist on CyberBeats and start earning from your music with transparent, instant payments.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card/30 border-cyber-purple/20 text-center p-4">
          <Zap className="h-8 w-8 text-cyber-purple mx-auto mb-2" />
          <h3 className="font-semibold text-cyber-purple">Instant Payouts</h3>
          <p className="text-sm text-muted-foreground">Get paid immediately for every stream</p>
        </Card>

        <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
          <Shield className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
          <h3 className="font-semibold text-cyber-pink">Full Control</h3>
          <p className="text-sm text-muted-foreground">Own your music and set your own prices</p>
        </Card>

        <Card className="bg-card/30 border-electric-blue/20 text-center p-4">
          <Coins className="h-8 w-8 text-electric-blue mx-auto mb-2" />
          <h3 className="font-semibold text-electric-blue">Fair Revenue</h3>
          <p className="text-sm text-muted-foreground">90% of revenue goes directly to you</p>
        </Card>

        <Card className="bg-card/30 border-neon-green/20 text-center p-4">
          <Music className="h-8 w-8 text-neon-green mx-auto mb-2" />
          <h3 className="font-semibold text-neon-green">Global Reach</h3>
          <p className="text-sm text-muted-foreground">Reach listeners worldwide instantly</p>
        </Card>
      </div>

      {/* Registration Form */}
      <ArtistRegistrationForm />

      {/* Additional Info */}
      <Card className="max-w-2xl mx-auto bg-card/30 border-border/50">
        <CardHeader>
          <CardTitle className="text-center text-cyber-purple">What happens next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-cyber-purple text-black text-sm flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Profile Creation</h4>
                <p className="text-sm text-muted-foreground">
                  Your artist profile will be created and prepared for blockchain integration
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-cyber-pink text-black text-sm flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Smart Contract Setup</h4>
                <p className="text-sm text-muted-foreground">
                  Your wallet will be linked to our Arbitrum smart contracts (coming soon)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-electric-blue text-black text-sm flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Start Uploading</h4>
                <p className="text-sm text-muted-foreground">
                  Upload your music and start earning from streams immediately
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
