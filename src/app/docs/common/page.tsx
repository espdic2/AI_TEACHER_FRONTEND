import { Separator } from "@/components/ui/separator"
import { User, Lock, Menu } from "lucide-react"

export default function CommonTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Tâches courantes</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Guide pour les fonctionnalités et tâches communes à tous les utilisateurs.
        </p>
      </div>

      <Separator />

      <div>
        <h2 id="profile" className="text-2xl font-bold mb-4">Gestion du profil</h2>
        <p className="mb-4">
          Apprenez à consulter et à mettre à jour vos informations de profil.
        </p>

        <h3 className="text-xl font-semibold mb-2">Consulter votre profil</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Cliquez sur votre nom ou avatar dans le coin supérieur droit de n'importe quelle page</li>
          <li>Sélectionnez <strong>Profil</strong> dans le menu déroulant</li>
          <li>Consultez vos informations de profil actuelles</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Mettre à jour les informations du profil</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Accédez à votre page de profil</li>
          <li>Cliquez sur <strong>Modifier le profil</strong></li>
          <li>Mettez à jour vos informations :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Nom</li>
              <li>Email</li>
              <li>Photo de profil (en téléchargeant une nouvelle image ou en utilisant vos initiales)</li>
            </ul>
          </li>
          <li>Cliquez sur <strong>Enregistrer les modifications</strong> pour mettre à jour votre profil</li>
        </ol>

        <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-400">Photo de profil</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Ajouter une photo de profil aide les professeurs et les administrateurs à vous identifier plus facilement. Si vous ne téléchargez pas de photo, vos initiales seront affichées à la place.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h2 id="authentication" className="text-2xl font-bold mb-4">Authentification</h2>
        <p className="mb-4">
          Apprenez à vous connecter, vous déconnecter et gérer votre mot de passe.
        </p>

        <h3 className="text-xl font-semibold mb-2">Connexion</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Accédez à la page de connexion</li>
          <li>Entrez votre email et votre mot de passe</li>
          <li>Cliquez sur <strong>Se connecter</strong></li>
          <li>Vous serez redirigé vers le tableau de bord spécifique à votre rôle</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Déconnexion</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Cliquez sur votre nom ou avatar dans le coin supérieur droit</li>
          <li>Sélectionnez <strong>Se déconnecter</strong> dans le menu déroulant</li>
          <li>Vous serez redirigé vers la page de connexion</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Récupération de mot de passe</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Cliquez sur <strong>Mot de passe oublié</strong> sur la page de connexion</li>
          <li>Entrez votre adresse email</li>
          <li>Vérifiez votre email pour les instructions de réinitialisation du mot de passe</li>
          <li>Suivez le lien pour créer un nouveau mot de passe</li>
        </ol>

        <div className="my-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-400">Sécurité du mot de passe</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Choisissez un mot de passe fort qui inclut un mélange de lettres, de chiffres et de caractères spéciaux. Ne partagez jamais votre mot de passe avec d'autres personnes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h2 id="navigation" className="text-2xl font-bold mb-4">Navigation</h2>
        <p className="mb-4">
          Apprenez à naviguer efficacement dans la plateforme.
        </p>

        <h3 className="text-xl font-semibold mb-2">Utilisation du fil d'Ariane</h3>
        <p className="mb-4">Le fil d'Ariane en haut de chaque page montre votre emplacement actuel dans la hiérarchie de la plateforme :</p>
        <ol className="list-decimal list-inside mb-4">
          <li>Chaque segment représente un niveau dans la navigation</li>
          <li>Cliquez sur n'importe quel segment pour naviguer vers ce niveau</li>
          <li>La page actuelle est affichée comme le dernier segment (non cliquable)</li>
        </ol>

        <div className="my-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-600 hover:underline cursor-pointer">Tableau de bord</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-blue-600 hover:underline cursor-pointer">Mes examens</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Détails de l'examen</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Design responsive</h3>
        <p className="mb-4">La plateforme est conçue pour fonctionner sur différents appareils :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Sur les écrans plus petits, la barre latérale se réduit à un bouton de menu</li>
          <li>Cliquez sur le bouton <Menu className="inline h-4 w-4" /> pour développer la barre latérale</li>
          <li>La mise en page s'ajuste automatiquement à la taille de votre écran</li>
        </ul>
      </div>
    </div>
  )
} 