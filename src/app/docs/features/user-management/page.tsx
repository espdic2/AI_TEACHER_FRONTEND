import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Users, UserPlus, UserCog, ShieldAlert } from "lucide-react"

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Apprenez à gérer les utilisateurs, les rôles et les permissions sur la plateforme.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Aperçu</h2>
        <p>
          Le système de gestion des utilisateurs permet aux administrateurs de créer, modifier et gérer les comptes utilisateurs.
          Cela inclut l'attribution de rôles, la gestion des permissions et le suivi de l'activité des utilisateurs.
        </p>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Administrateur uniquement</AlertTitle>
          <AlertDescription>
            Les fonctionnalités de gestion des utilisateurs sont uniquement disponibles pour les administrateurs. Les professeurs et les étudiants ne peuvent pas
            accéder à ces fonctionnalités.
          </AlertDescription>
        </Alert>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Rôles des Utilisateurs</h2>
        <p>
          La plateforme comporte trois rôles principaux d'utilisateurs, chacun avec des permissions et des capacités différentes.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Administrateur</h3>
              <p className="text-sm text-muted-foreground">
                Accès complet à toutes les fonctionnalités de la plateforme, y compris la gestion des utilisateurs, les paramètres système et l'analytique.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Professeur</h3>
              <p className="text-sm text-muted-foreground">
                Peut créer et gérer des classes, créer des examens, noter les soumissions et consulter les performances des étudiants.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Étudiant</h3>
              <p className="text-sm text-muted-foreground">
                Peut consulter les classes inscrites, passer des examens, consulter les notes et suivre ses performances personnelles.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Création d'Utilisateurs</h2>
        <p>
          Les administrateurs peuvent créer de nouveaux comptes utilisateurs sur la plateforme.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Création d'un Utilisateur Unique</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers <strong>Tableau de bord &gt; Utilisateurs &gt; Ajouter un Utilisateur</strong></li>
          <li>Remplissez les détails de l'utilisateur :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Nom complet</li>
              <li>Adresse email</li>
              <li>Rôle (Administrateur, Professeur ou Étudiant)</li>
              <li>Informations supplémentaires (optionnel)</li>
            </ul>
          </li>
          <li>Cliquez sur <strong>Créer l'Utilisateur</strong></li>
          <li>Le système enverra un email d'invitation au nouvel utilisateur</li>
        </ol>

        <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <UserPlus className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-400">Création en Masse d'Utilisateurs</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Pour ajouter plusieurs utilisateurs à la fois, utilisez la fonctionnalité d'importation en masse. Préparez un fichier CSV avec les détails des utilisateurs
                (nom, email, rôle) et téléchargez-le via l'option <strong>Importation en Masse</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Gestion des Utilisateurs Existants</h2>
        <p>
          Les administrateurs peuvent consulter, modifier et gérer tous les comptes utilisateurs.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Consultation des Utilisateurs</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers <strong>Tableau de bord &gt; Utilisateurs</strong></li>
          <li>Consultez la liste de tous les utilisateurs</li>
          <li>Filtrez les utilisateurs par rôle, statut ou recherchez par nom/email</li>
          <li>Cliquez sur un utilisateur pour consulter ses détails</li>
        </ol>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Modification des Détails Utilisateur</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers la page de détails de l'utilisateur</li>
          <li>Cliquez sur <strong>Modifier</strong></li>
          <li>Mettez à jour les informations de l'utilisateur</li>
          <li>Cliquez sur <strong>Enregistrer les Modifications</strong></li>
        </ol>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Changement de Rôle Utilisateur</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers la page de détails de l'utilisateur</li>
          <li>Cliquez sur <strong>Changer de Rôle</strong></li>
          <li>Sélectionnez le nouveau rôle</li>
          <li>Cliquez sur <strong>Mettre à Jour le Rôle</strong></li>
        </ol>

        <div className="my-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <UserCog className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-400">Implications du Changement de Rôle</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Changer le rôle d'un utilisateur affecte ses permissions et son accès aux fonctionnalités. Assurez-vous que toutes
                les responsabilités en cours (classes, examens) sont correctement réassignées avant de changer les rôles.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Gestion des Comptes Utilisateurs</h2>
        <p>
          Les administrateurs peuvent gérer le statut et la sécurité des comptes utilisateurs.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Désactivation de Comptes</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers la page de détails de l'utilisateur</li>
          <li>Cliquez sur <strong>Désactiver le Compte</strong></li>
          <li>Confirmez l'action</li>
          <li>L'utilisateur ne pourra plus se connecter</li>
        </ol>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Réactivation de Comptes</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers <strong>Tableau de bord &gt; Utilisateurs</strong></li>
          <li>Filtrez pour afficher les utilisateurs inactifs</li>
          <li>Cliquez sur l'utilisateur pour consulter ses détails</li>
          <li>Cliquez sur <strong>Réactiver le Compte</strong></li>
        </ol>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Réinitialisation de Mot de Passe</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers la page de détails de l'utilisateur</li>
          <li>Cliquez sur <strong>Réinitialiser le Mot de Passe</strong></li>
          <li>Le système enverra un lien de réinitialisation de mot de passe à l'email de l'utilisateur</li>
        </ol>

        <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-400">Considérations de Sécurité</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Ne réinitialisez les mots de passe que lorsque c'est absolument nécessaire. Les liens de réinitialisation de mot de passe expirent après 24 heures.
                Vérifiez toujours l'identité des utilisateurs demandant des réinitialisations de mot de passe par d'autres moyens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 