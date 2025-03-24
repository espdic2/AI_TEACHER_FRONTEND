"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle, Info, Loader2, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/hooks"
import { login } from "@/store/features/auth/authSlice"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation de base
    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide")
      return
    }

    if (!validatePassword(password)) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setIsLoading(true)
    
    try {
      await dispatch(login({ email, password, rememberMe })).unwrap()
      toast.success("Connexion réussie", {
        description: "Redirection vers le tableau de bord..."
      })
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } catch (err) {
      setError("Email ou mot de passe incorrect. Veuillez réessayer.")
      toast.error("Erreur d'authentification", {
        description: "Email ou mot de passe incorrect"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col md:flex-row transition-opacity duration-500",
      mounted ? "opacity-100" : "opacity-0"
    )}>
      {/* Panneau gauche - Formulaire de connexion */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-2 group cursor-pointer">
            <GraduationCap className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold">Class</span>
            <span className="text-2xl font-bold bg-blue-500 text-primary-foreground px-2 py-1 rounded transition-colors hover:bg-blue-600">
              Matrix
            </span>
          </div>

          <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0 space-y-4">
              <CardTitle className="text-3xl font-bold tracking-tight">Bienvenue</CardTitle>
              <CardDescription className="text-base">
                Entrez vos identifiants pour accéder à votre tableau de bord d'apprentissage personnalisé
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              {error && (
                <Alert variant="destructive" className="mb-6 animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium inline-block">
                    Adresse email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      className="pl-10 h-11 transition-shadow focus:ring-2 focus:ring-primary/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Mot de passe
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link 
                            href="#" 
                            className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center group"
                          >
                            Mot de passe oublié ?
                            <Info className="ml-1 h-3 w-3 transition-transform group-hover:scale-110" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-primary text-primary-foreground">
                          <p>Contactez le support pour réinitialiser votre mot de passe</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10 h-11 transition-shadow focus:ring-2 focus:ring-primary/20"
                      value={password}
                      placeholder="********"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary transition-colors"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Rester connecté pendant 30 jours
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 font-medium transition-all bg-blue-500 hover:bg-blue-600 text-primary-foreground hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center  gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Se connecter <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-sm text-center text-muted-foreground">
            En continuant, vous acceptez nos{" "}
            <Link href="#" className="text-primary hover:underline">
              Conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="#" className="text-primary hover:underline">
              Politique de confidentialité
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Panneau droit - Illustration */}
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary/5 to-primary/10 p-12 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <Image
            src="/auto_test.jpg"
            alt="Plateforme d'apprentissage intelligente"
            width={800}
            height={600}
            className="object-cover rounded-xl shadow-2xl transition-transform hover:scale-105 duration-700"
            priority
          />
        </div>
        <div className="absolute bottom-12 left-12 right-12">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:translate-y-[-8px]">
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Transformez votre parcours d'apprentissage
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Découvrez un apprentissage personnalisé avec la technologie IA de pointe de ClassMatrix.
              Suivez vos progrès, collaborez avec vos pairs et atteignez vos objectifs éducatifs plus rapidement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
