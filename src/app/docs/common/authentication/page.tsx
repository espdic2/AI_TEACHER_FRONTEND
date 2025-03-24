import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, LogIn, UserPlus, KeyRound, Mail } from "lucide-react"
import Image from "next/image";

export default function AuthenticationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Authentification</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Guide pour se connecter, s'inscrire et gérer l'accès à la plateforme.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Aperçu</h2>
        <p>
          Notre système d'authentification sécurise l'accès à la plateforme et garantit que les utilisateurs
          n'accèdent qu'aux fonctionnalités correspondant à leur rôle.
        </p>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Sécurité des comptes</AlertTitle>
          <AlertDescription>
            Pour protéger votre compte, utilisez un mot de passe fort et unique, et ne partagez jamais vos identifiants de connexion.
          </AlertDescription>
        </Alert>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Connexion</h2>


        <Image src="/docs/image.png" width="800" height="200" className="object-contain"  alt={""}/>
        
        <p>Pour vous connecter à la plateforme :</p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Accédez à la page de connexion</li>
          <li>Entrez votre adresse e-mail</li>
          <li>Entrez votre mot de passe</li>
          <li>Cliquez sur le bouton "Se connecter"</li>
        </ol>
        
        <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800 mt-4">
          <KeyRound className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm">
            Si vous avez oublié votre mot de passe, cliquez sur le lien "Mot de passe oublié ?" sur la page de connexion pour le réinitialiser.
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Déconnexion</h2>
        <p>
          Pour vous déconnecter de la plateforme :
        </p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Cliquez sur votre avatar ou nom d'utilisateur dans le coin supérieur droit</li>
          <li>Sélectionnez "Déconnexion" dans le menu déroulant</li>
        </ol>
        
        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 mt-4">
          <Info className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm">
            Pour des raisons de sécurité, vous serez automatiquement déconnecté après une période d'inactivité.
          </p>
        </div>
      </div>
    </div>
  )
} 