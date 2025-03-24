import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Shield } from "lucide-react"
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Gestion du profil</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Guide pour gérer et personnaliser votre profil utilisateur.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Aperçu</h2>
        <p>
          Votre profil utilisateur contient vos informations personnelles et vos préférences sur la plateforme.
          Vous pouvez le personnaliser pour améliorer votre expérience.
        </p>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Confidentialité</AlertTitle>
          <AlertDescription>
            Certaines informations de votre profil peuvent être visibles par d'autres utilisateurs, selon les paramètres de confidentialité que vous choisissez.
          </AlertDescription>
        </Alert>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Accéder à votre profil</h2>
        
        <p>Pour accéder à votre profil :</p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Cliquez sur votre avatar ou nom d'utilisateur dans le coin supérieur droit</li>
          <li>Sélectionnez "Mon profil" dans le menu déroulant</li>
        </ol>


        <Image src="/docs/img_7.png" width="800" height="200" className="object-contain"  alt={""}/>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Modifier les informations du profil</h2>
        <p>
          Vous pouvez mettre à jour vos informations personnelles :
        </p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Accédez à votre profil</li>
          <li>Cliquez sur le bouton "Modifier le profil"</li>
          <li>Mettez à jour vos informations :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Nom et prénom</li>
              <li>Adresse e-mail</li>
              <li>Numéro de téléphone (optionnel)</li>
              <li>Biographie (optionnel)</li>
            </ul>
          </li>
          <li>Cliquez sur "Enregistrer les modifications"</li>
        </ol>
        
        <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800 mt-4">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm">
            Si vous modifiez votre adresse e-mail, vous devrez peut-être vérifier la nouvelle adresse avant que le changement ne soit effectif.
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Changer votre photo de profil</h2>
        <p>
          Pour personnaliser votre avatar :
        </p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Accédez à votre profil</li>
          <li>Cliquez sur votre photo de profil actuelle ou sur l'icône d'avatar</li>
          <li>Sélectionnez "Changer la photo"</li>
          <li>Téléchargez une nouvelle image ou choisissez parmi les avatars prédéfinis</li>
          <li>Recadrez l'image si nécessaire</li>
          <li>Cliquez sur "Enregistrer"</li>
        </ol>
        
        <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800 mt-4">
          <Image className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm">
            Pour de meilleurs résultats, utilisez une image carrée d'au moins 200x200 pixels.
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Paramètres de sécurité</h2>
        <p>
          Gérez la sécurité de votre compte :
        </p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Accédez à votre profil</li>
          <li>Cliquez sur l'onglet "Sécurité"</li>
          <li>Ici, vous pouvez :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Changer votre mot de passe</li>
              <li>Configurer l'authentification à deux facteurs (si disponible)</li>
              <li>Consulter les sessions actives</li>
              <li>Révoquer l'accès des appareils non reconnus</li>
            </ul>
          </li>
        </ol>
        
        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 mt-4">
          <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm">
            Nous recommandons fortement d'activer l'authentification à deux facteurs pour une sécurité optimale.
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Préférences de notification</h2>
        <p>
          Personnalisez les notifications que vous recevez :
        </p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Accédez à votre profil</li>
          <li>Cliquez sur l'onglet "Notifications"</li>
          <li>Activez ou désactivez les différents types de notifications :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Nouveaux examens assignés</li>
              <li>Résultats d'examens</li>
              <li>Annonces de classe</li>
              <li>Rappels d'échéance</li>
              <li>Notifications par e-mail</li>
              <li>Notifications dans l'application</li>
            </ul>
          </li>
          <li>Cliquez sur "Enregistrer les préférences"</li>
        </ol>
      </div>
    </div>
  )
} 