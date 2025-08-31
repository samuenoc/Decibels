import { SongUploadForm } from "@/components/forms/song-upload-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Shield, Zap, Globe } from "lucide-react"

export default function UploadPage() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance">
          <span className="text-cyber-pink">Sube</span> <span className="text-cyber-purple">Tu Música</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Comparte tu creatividad con el mundo. Sube tus canciones y comienza a ganar con cada reproducción a través de la
          tecnología descentralizada.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card/30 border-cyber-pink/20 text-center p-4">
          <Upload className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
          <h3 className="font-semibold text-cyber-pink">Subida Fácil</h3>
          <p className="text-sm text-muted-foreground">Arrastra y suelta tus archivos para subirlos al instante</p>
        </Card>

        <Card className="bg-card/30 border-cyber-purple/20 text-center p-4">
          <Shield className="h-8 w-8 text-cyber-purple mx-auto mb-2" />
          <h3 className="font-semibold text-cyber-purple">Almacenamiento IPFS</h3>
          <p className="text-sm text-muted-foreground">El almacenamiento descentralizado garantiza permanencia</p>
        </Card>

        <Card className="bg-card/30 border-electric-blue/20 text-center p-4">
          <Zap className="h-8 w-8 text-electric-blue mx-auto mb-2" />
          <h3 className="font-semibold text-electric-blue">Disponible al Instante</h3>
          <p className="text-sm text-muted-foreground">Tu música se publica de inmediato</p>
        </Card>

        <Card className="bg-card/30 border-neon-green/20 text-center p-4">
          <Globe className="h-8 w-8 text-neon-green mx-auto mb-2" />
          <h3 className="font-semibold text-neon-green">Acceso Global</h3>
          <p className="text-sm text-muted-foreground">Llega a oyentes de todo el mundo al instante</p>
        </Card>
      </div>

      {/* Upload Form */}
      <SongUploadForm />

      {/* Technical Details */}
      <Card className="max-w-2xl mx-auto bg-card/30 border-border/50">
        <CardHeader>
          <CardTitle className="text-center text-cyber-purple">Cómo Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-cyber-pink text-black text-sm flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Procesamiento del Archivo</h4>
                <p className="text-sm text-muted-foreground">
                  Tu archivo de audio es procesado y optimizado para streaming
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-cyber-purple text-black text-sm flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Subida a IPFS</h4>
                <p className="text-sm text-muted-foreground">
                  El archivo se almacena en IPFS para un acceso descentralizado y permanente
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-electric-blue text-black text-sm flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Registro en Blockchain</h4>
                <p className="text-sm text-muted-foreground">
                  Los metadatos y la propiedad se registran en la blockchain de Arbitrum
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-neon-green text-black text-sm flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold">Publicación</h4>
                <p className="text-sm text-muted-foreground">Tu música está disponible para streaming de inmediato</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
