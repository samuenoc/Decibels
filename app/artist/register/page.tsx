"use client"

import { ArtistRegistrationForm } from "@/components/forms/artist-registration-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Coins, Upload, TrendingUp } from "lucide-react"

export default function ArtistRegisterPage() {
    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-balance">
                    <span className="text-cyber-pink">Unete como</span> <span className="text-cyber-pink">Artista</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                    Crea tu cuenta de artista para cargar música y comenzar a ganar dinero con cada transmisión. Conecta tu billetera y monetiza tu creatividad.
                </p>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
                    <Coins className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-pink">Pagos Instantaneos</h3>
                    <p className="text-sm text-muted-foreground">Recibe un pago por cada transmisión al instante</p>
                </Card>

                <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
                    <Upload className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-pink">Facil de Subir</h3>
                    <p className="text-sm text-muted-foreground">Sube tu musica con un simple click</p>
                </Card>

                <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
                    <TrendingUp className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-pink">Analiticas</h3>
                    <p className="text-sm text-muted-foreground">Realiza un seguimiento de tu desempeño y tus ganancias</p>
                </Card>

                <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
                    <Mic className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-pink">Control Completo</h3>
                    <p className="text-sm text-muted-foreground">Se dueño de tu música y tus derechos por completo</p>
                </Card>
            </div>

            {/* Registration Form */}
            <ArtistRegistrationForm />

            {/* Additional Info */}
            <Card className="max-w-2xl mx-auto bg-card/30 border-border/50">
                <CardHeader>
                    <CardTitle className="text-center text-cyber-pink">¿Por qué unirse como artista?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-pink text-black text-sm flex items-center justify-center font-bold">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold">Conecta tu Wallet</h4>
                                <p className="text-sm text-muted-foreground">
                                    Vincula tu billetera Rabby para recibir los pagos
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-pink text-black text-sm flex items-center justify-center font-bold">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold">Crea un perfil de Artista</h4>
                                <p className="text-sm text-muted-foreground">
                                    Configura tu perfil de artista con biografía y género
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-pink text-black text-sm flex items-center justify-center font-bold">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold">Sube y empieza a ganar</h4>
                                <p className="text-sm text-muted-foreground">
                                    Sube tu música y comienza a ganar dinero con las transmisiones
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-pink text-black text-sm flex items-center justify-center font-bold">
                                4
                            </div>
                            <div>
                                <h4 className="font-semibold">Rastrea tu rendimiento</h4>
                                <p className="text-sm text-muted-foreground">
                                    Monitorea tus transmisiones, ganancias y audiencia
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
