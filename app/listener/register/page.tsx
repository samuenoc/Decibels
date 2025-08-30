"use client"

import { ListenerRegistrationForm } from "@/components/forms/listener-registration-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Music, Headphones } from "lucide-react"

export default function ListenerRegisterPage() {
    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-balance">
                    <span className="text-cyber-purple">Join as</span> <span className="text-cyber-purple">Listener</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                    Create your listener account to start enjoying music on CyberBeats. Connect your wallet and start streaming.
                </p>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-card/30 border-cyber-purple/20 text-center p-4">
                    <Headphones className="h-8 w-8 text-cyber-purple mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-purple">Unlimited Streaming</h3>
                    <p className="text-sm text-muted-foreground">Listen to all music without restrictions</p>
                </Card>

                <Card className="bg-card/30 border-cyber-purple/20 text-center p-4">
                    <Music className="h-8 w-8 text-cyber-purple mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-purple">High Quality Audio</h3>
                    <p className="text-sm text-muted-foreground">Lossless streaming with premium quality</p>
                </Card>

                <Card className="bg-card/30 border-cyber-purple/20 text-center p-4">
                    <User className="h-8 w-8 text-cyber-purple mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-purple">Free Account</h3>
                    <p className="text-sm text-muted-foreground">No subscription fees, completely free</p>
                </Card>
            </div>

            {/* Registration Form */}
            <ListenerRegistrationForm />

            {/* Additional Info */}
            <Card className="max-w-2xl mx-auto bg-card/30 border-border/50">
                <CardHeader>
                    <CardTitle className="text-center text-cyber-purple">Why Join as a Listener?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-purple text-black text-sm flex items-center justify-center font-bold">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold">Connect Wallet</h4>
                                <p className="text-sm text-muted-foreground">
                                    Link your MetaMask wallet for secure authentication
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-purple text-black text-sm flex items-center justify-center font-bold">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold">Create Account</h4>
                                <p className="text-sm text-muted-foreground">
                                    Simple registration with email and password
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-purple text-black text-sm flex items-center justify-center font-bold">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold">Start Listening</h4>
                                <p className="text-sm text-muted-foreground">
                                    Access all music and start streaming immediately
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
