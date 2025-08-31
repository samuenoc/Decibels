"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Zap, Shield, Coins, User, Mic } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useUserMode } from "@/components/providers/user-mode-provider"

export default function HomePage() {
  const { userMode } = useUserMode()

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-balance">
            <span className="text-cyber-purple">Deci</span>
            <span className="text-cyber-pink">Bels</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            El futuro del streaming musical. Descentralizado, transparente y potenciado por tecnología blockchain.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center">
          <ModeToggle />
        </div>

        <div className="flex gap-4 justify-center">
          {userMode === "listener" ? (
            <>
              <Link href="/songs">
                <Button size="lg" className="bg-cyber-purple hover:bg-cyber-purple/80 glow-purple">
                  <Music className="h-5 w-5 mr-2" />
                  Explorar Música
                </Button>
              </Link>
              <Link href="/listener/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black glow-purple bg-transparent"
                >
                  <User className="h-5 w-5 mr-2" />
                  Unirse como Oyente
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/artist/upload">
                <Button size="lg" className="bg-cyber-pink hover:bg-cyber-pink/80 glow-pink">
                  <Mic className="h-5 w-5 mr-2" />
                  Subir Música
                </Button>
              </Link>
              <Link href="/artist/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black glow-pink bg-transparent"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Convertirse en Artista
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-cyber-purple/20 hover:border-cyber-purple/40 transition-colors">
          <CardHeader>
            <Zap className="h-8 w-8 text-cyber-purple mb-2" />
            <CardTitle className="text-cyber-purple">Pagos Instantáneos</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Los artistas reciben pagos instantáneos por cada reproducción mediante contratos inteligentes en Arbitrum.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-cyber-pink/20 hover:border-cyber-pink/40 transition-colors">
          <CardHeader>
            <Shield className="h-8 w-8 text-cyber-pink mb-2" />
            <CardTitle className="text-cyber-pink">Descentralizado</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Sin intermediarios. Conexión directa entre artistas y oyentes a través de blockchain.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-electric-blue/20 hover:border-electric-blue/40 transition-colors">
          <CardHeader>
            <Music className="h-8 w-8 text-electric-blue mb-2" />
            <CardTitle className="text-electric-blue">Alta Calidad</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Streaming de audio sin pérdida con metadatos almacenados permanentemente en IPFS.</CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-neon-green/20 hover:border-neon-green/40 transition-colors">
          <CardHeader>
            <Coins className="h-8 w-8 text-neon-green mb-2" />
            <CardTitle className="text-neon-green">Ingresos Justos</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Reparto de ingresos transparente con análisis en tiempo real y pagos instantáneos.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="bg-card/30 rounded-lg p-8 border border-border">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-cyber-purple mb-2">0</div>
            <div className="text-muted-foreground">Artistas Registrados</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyber-pink mb-2">0</div>
            <div className="text-muted-foreground">Canciones Subidas</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-electric-blue mb-2">0</div>
            <div className="text-muted-foreground">Reproducciones Totales</div>
          </div>
        </div>
      </section>
    </div>
  )
}
