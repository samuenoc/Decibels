"use client"

// Extender la interfaz de Window para incluir 'rabby'
declare global {
  interface Window {
    rabby?: any
  }
}

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Music, Wallet } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "@/hooks/use-toast"

export function ListenerRegistrationForm() {
  const { register, isWalletConnected, connectWallet } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAccountCreated, setIsAccountCreated] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true) // Default to login view
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })
  const [isLoginWalletConnected, setIsLoginWalletConnected] = useState(false)
  const [loginStep, setLoginStep] = useState<'credentials' | 'wallet'>('credentials')

  const handleWalletConnect = async () => {
    try {
      if (typeof window.rabby !== "undefined") {
        const accounts = await window.rabby.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          const address = accounts[0]
          localStorage.setItem('walletAddressX', address)
          connectWallet(address)
          toast({
            title: "Wallet conectada",
            description: "¡Tu wallet se ha conectado exitosamente!",
          })
        }
      } else {
        toast({
          title: "Rabby no encontrada",
          description: "Por favor instala la wallet de Rabby para continuar y conectar",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Conexión fallida",
        description: "Fallo al conectar la wallet, intenta de nuevo",
        variant: "destructive",
      })
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Contraseñas no coinciden",
        description: "Las contraseñas no son iguales. Intenta de nuevo.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await register({
        email: formData.email,
        username: formData.email.split("@")[0], // Usamos el prefijo del email como username
        role: "listener",
      })

      if (success) {
        // Save to localStorage
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userType', 'listener')
        localStorage.setItem('userEmail', formData.email)
        
        // Trigger navigation update
        window.dispatchEvent(new Event('authStateChanged'))
        
        setIsAccountCreated(true)
        toast({
          title: "Cuenta creada",
          description: "¡Tu cuenta de oyente se creó exitosamente!",
        })
        
        // Redirect to listener dashboard after showing success message
        setTimeout(() => {
          router.push("/listener/dashboard")
        }, 1500)
      } else {
        toast({
          title: "Error en el registro",
          description: "No se pudo crear la cuenta de oyente. Intenta de nuevo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error en el registro",
        description: "Ocurrió un error durante el registro.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectWallet = async () => {
    if (!isAccountCreated) {
      toast({
        title: "Cuenta requerida",
        description: "Por favor crea tu cuenta primero.",
        variant: "destructive",
      })
      return
    }

    try {
      if (typeof window.rabby !== "undefined") {
        const accounts = await window.rabby.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          const address = accounts[0]
          connectWallet(address)
          toast({
            title: "Wallet conectada",
            description: "¡Tu wallet se ha conectado exitosamente!",
          })

          // Redirección automática al dashboard de oyente
          setTimeout(() => {
            router.push("http://localhost:3000/listener/dashboard")
          }, 1500) // Espera 1.5 segundos para que el usuario vea el toast de éxito
        }
      } else {
        toast({
          title: "Rabby no encontrada",
          description: "Por favor instala Rabby para conectar tu wallet.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Conexión fallida",
        description: "No se pudo conectar la wallet. Intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLoginInputChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate login validation
      if (loginData.email && loginData.password) {
        toast({
          title: "Credenciales válidas",
          description: "Ahora conecta tu wallet para completar el login.",
        })
        setLoginStep('wallet')
      } else {
        toast({
          title: "Error de login",
          description: "Por favor verifica tus credenciales.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error de login",
        description: "Ocurrió un error durante el login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginWalletConnect = async () => {
    try {
      if (typeof window.rabby !== "undefined") {
        const accounts = await window.rabby.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          const address = accounts[0]
          console.log("Login wallet address:", address)
          setIsLoginWalletConnected(true)
          toast({
            title: "Wallet conectada",
            description: "¡Login completado exitosamente!",
          })

          // Save to localStorage
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('userType', 'listener')
          localStorage.setItem('userEmail', loginData.email)
          localStorage.setItem('walletAddressX', address)
          // Trigger navigation update
          window.dispatchEvent(new Event('authStateChanged'))

          // Redirect to listener dashboard
          setTimeout(() => {
            router.push("/listener/dashboard")
          }, 1000)
        }
      } else {
        toast({
          title: "Rabby no encontrada",
          description: "Por favor instala Rabby para conectar tu wallet.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Conexión fallida",
        description: "No se pudo conectar la wallet. Intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    // Reset forms when switching modes
    setLoginData({ email: "", password: "" })
    setFormData({
      email: "",
      password: "",
      confirmPassword: ""
    })
    setIsAccountCreated(false)
  }

  return (
    <Card className="max-w-md mx-auto bg-card/30 border-cyber-purple/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-cyber-purple rounded-full flex items-center justify-center">
          <Music className="h-6 w-6 text-black" />
        </div>
        <CardTitle className="text-2xl font-bold text-cyber-purple">
          {isLoginMode ? "Iniciar Sesión" : "Registrarse como Oyente"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isLoginMode 
            ? "Ingresa a tu cuenta de oyente" 
            : "Crea tu cuenta para empezar a disfrutar de la música"
          }
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoginMode ? (
          /* Login Form */
          <div className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Correo electrónico</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => handleLoginInputChange("email", e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  required
                  className="bg-input/50 border-border focus:border-cyber-purple"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => handleLoginInputChange("password", e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="bg-input/50 border-border focus:border-cyber-purple"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyber-purple hover:bg-cyber-purple/80 glow-purple"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Iniciando sesión...
                  </div>
                ) : (
                  <>Login</>
                )}
              </Button>
            </form>

            {/* Wallet Connection Step */}
            {loginStep === 'wallet' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-foreground mb-2">Paso 2: Conectar Wallet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Conecta tu wallet de Rabby para completar el login
                  </p>
                </div>

                <Button
                  onClick={handleLoginWalletConnect}
                  disabled={isLoginWalletConnected}
                  className={`w-full ${isLoginWalletConnected
                    ? "bg-neon-green text-black cursor-not-allowed"
                    : "bg-cyber-purple hover:bg-cyber-purple/80 glow-purple"
                    }`}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {isLoginWalletConnected ? "Wallet conectada" : "Conectar a Rabby"}
                </Button>
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-muted-foreground hover:text-cyber-purple transition-colors"
              >
                ¿No tienes una cuenta? Regístrate
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">Paso 1: Crear cuenta de oyente</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Completa tus datos para crear una cuenta de oyente
              </p>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  required
                  className="bg-input/50 border-border focus:border-cyber-purple"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Crea una contraseña"
                  required
                  className="bg-input/50 border-border focus:border-cyber-purple"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirma tu contraseña"
                  required
                  className="bg-input/50 border-border focus:border-cyber-purple"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyber-purple hover:bg-cyber-purple/80 glow-purple"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creando cuenta de oyente...
                  </div>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Crear cuenta de oyente
                  </>
                )}
              </Button>
            </form>

            {/* Sección de conexión de wallet */}
            {isAccountCreated && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-foreground mb-2">Paso 2: Conectar Wallet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Conecta tu wallet de Rabby para completar el registro
                  </p>
                </div>

                <Button
                  onClick={handleConnectWallet}
                  disabled={isWalletConnected}
                  className={`w-full ${isWalletConnected
                    ? "bg-neon-green text-black cursor-not-allowed"
                    : "bg-cyber-purple hover:bg-cyber-purple/80 glow-purple"
                    }`}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {isWalletConnected ? "Wallet conectada" : "Conectar a Rabby"}
                </Button>
              </div>
            )}

            {!isAccountCreated && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-muted-foreground hover:text-cyber-purple transition-colors"
                >
                  ¿Ya tienes una cuenta? Inicia sesión
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}