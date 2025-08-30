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
                    <span className="text-cyber-pink">Join as</span> <span className="text-cyber-pink">Artist</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                    Create your artist account to upload music and start earning from every stream. Connect your wallet and monetize your creativity.
                </p>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
                    <Coins className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-pink">Instant Payments</h3>
                    <p className="text-sm text-muted-foreground">Get paid for every stream instantly</p>
                </Card>

                <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
                    <Upload className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-pink">Easy Upload</h3>
                    <p className="text-sm text-muted-foreground">Upload your music with one click</p>
                </Card>

                <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
                    <TrendingUp className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-pink">Analytics</h3>
                    <p className="text-sm text-muted-foreground">Track your performance and earnings</p>
                </Card>

                <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
                    <Mic className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
                    <h3 className="font-semibold text-cyber-pink">Full Control</h3>
                    <p className="text-sm text-muted-foreground">Own your music and rights completely</p>
                </Card>
            </div>

            {/* Registration Form */}
            <ArtistRegistrationForm />

            {/* Additional Info */}
            <Card className="max-w-2xl mx-auto bg-card/30 border-border/50">
                <CardHeader>
                    <CardTitle className="text-center text-cyber-pink">Why Join as an Artist?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-pink text-black text-sm flex items-center justify-center font-bold">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold">Connect Wallet</h4>
                                <p className="text-sm text-muted-foreground">
                                    Link your MetaMask wallet to receive payments
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-pink text-black text-sm flex items-center justify-center font-bold">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold">Create Artist Profile</h4>
                                <p className="text-sm text-muted-foreground">
                                    Set up your artist profile with bio and genre
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-pink text-black text-sm flex items-center justify-center font-bold">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold">Upload & Earn</h4>
                                <p className="text-sm text-muted-foreground">
                                    Upload your music and start earning from streams
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyber-pink text-black text-sm flex items-center justify-center font-bold">
                                4
                            </div>
                            <div>
                                <h4 className="font-semibold">Track Performance</h4>
                                <p className="text-sm text-muted-foreground">
                                    Monitor your streams, earnings, and audience
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
