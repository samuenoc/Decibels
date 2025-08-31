"use client"

import { ListenerRegistrationForm } from "@/components/forms/listener-registration-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Music, Headphones } from "lucide-react"

export default function ListenerRegisterPage() {
    return (
        <div className="space-y-12">
            {/* Sección de encabezado */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-balance">
                    <span className="text-cyber-purple">Únete como</span>{" "}
                    <span className="text-cyber-purple">Oyente</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                    Crea tu cuenta de oyente para empezar a disfrutar música en CyberBeats. Conecta tu wallet y comienza a reproducir.
                </p>
            </div>

            {/* Sección de beneficios */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-card/30 border-cyber-purple/20 text-center p-4">
                    <Headphones className="h-8 w-8 text-cyber-purple mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-purple">Streaming Ilimitado</h3>
                    <p className="text-sm text-muted-foreground">Escucha toda la música sin restricciones</p>
                </Card>

                <Card className="bg-card/30 border-cyber-purple/20 text-center p-4">
                    <Music className="h-8 w-8 text-cyber-purple mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-purple">Audio de Alta Calidad</h3>
                    <p className="text-sm text-muted-foreground">Streaming sin pérdida y con calidad premium</p>
                </Card>

                <Card className="bg-card/30 border-cyber-purple/20 text-center p-4">
                    <User className="h-8 w-8 text-cyber-purple mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-purple">Cuenta Gratuita</h3>
                    <p className="text-sm text-muted-foreground">Sin tarifas de suscripción, completamente gratis</p>
                </Card>
            </div>

            {/* Formulario de registro */}
            <ListenerRegistrationForm />

            {/* Información adicional */}
            <Card className="max-w-2xl mx-auto bg-card/30 border-border/50">
                <CardHeader>
                    <CardTitle className="text-center text-cyber-purple">
                        ¿Por qué unirte como oyente?
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-purple text-black text-sm flex items-center justify-center font-bold">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold">Conectar Wallet</h4>
                                <p className="text-sm text-muted-foreground">
                                    Vincula tu wallet MetaMask para una autenticación segura
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-purple text-black text-sm flex items-center justify-center font-bold">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold">Crear Cuenta</h4>
                                <p className="text-sm text-muted-foreground">
                                    Registro sencillo con correo electrónico y contraseña
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-purple text-black text-sm flex items-center justify-center font-bold">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold">Comienza a Escuchar</h4>
                                <p className="text-sm text-muted-foreground">
                                    Accede a toda la música y empieza a reproducir de inmediato
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
