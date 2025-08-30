import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Zap, Shield, Coins } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-balance">
            <span className="text-cyber-purple">Cyber</span>
            <span className="text-cyber-pink">Beats</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            The future of music streaming. Decentralized, transparent, and powered by blockchain technology.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/songs">
            <Button size="lg" className="bg-cyber-purple hover:bg-cyber-purple/80 glow-purple">
              <Music className="h-5 w-5 mr-2" />
              Explore Music
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black glow-pink bg-transparent"
            >
              Become an Artist
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-cyber-purple/20 hover:border-cyber-purple/40 transition-colors">
          <CardHeader>
            <Zap className="h-8 w-8 text-cyber-purple mb-2" />
            <CardTitle className="text-cyber-purple">Instant Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Artists get paid instantly for every play through smart contracts on Arbitrum.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-cyber-pink/20 hover:border-cyber-pink/40 transition-colors">
          <CardHeader>
            <Shield className="h-8 w-8 text-cyber-pink mb-2" />
            <CardTitle className="text-cyber-pink">Decentralized</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              No middlemen. Direct connection between artists and listeners through blockchain.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-electric-blue/20 hover:border-electric-blue/40 transition-colors">
          <CardHeader>
            <Music className="h-8 w-8 text-electric-blue mb-2" />
            <CardTitle className="text-electric-blue">High Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Lossless audio streaming with metadata stored permanently on IPFS.</CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-neon-green/20 hover:border-neon-green/40 transition-colors">
          <CardHeader>
            <Coins className="h-8 w-8 text-neon-green mb-2" />
            <CardTitle className="text-neon-green">Fair Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Transparent revenue sharing with real-time analytics and instant payouts.</CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="bg-card/30 rounded-lg p-8 border border-border">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-cyber-purple mb-2">0</div>
            <div className="text-muted-foreground">Artists Registered</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyber-pink mb-2">0</div>
            <div className="text-muted-foreground">Songs Uploaded</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-electric-blue mb-2">0</div>
            <div className="text-muted-foreground">Total Plays</div>
          </div>
        </div>
      </section>
    </div>
  )
}
