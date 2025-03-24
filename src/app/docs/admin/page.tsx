import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Users, FileText, GraduationCap } from "lucide-react"
import Image from "next/image";

export default function AdminDocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manuel de l'Administrateur</h1>
        <p className="text-muted-foreground mb-6">
          Ce guide vous aidera à comprendre et à utiliser toutes les fonctionnalités administratives disponibles.
        </p>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Privilèges d'administrateur</AlertTitle>
          <AlertDescription>
            En tant qu'administrateur, vous avez accès à toutes les fonctionnalités de la plateforme, y compris la gestion des utilisateurs, 
            la création de classes et les analyses du système.
          </AlertDescription>
        </Alert>
      </div>

      <div>
        <h2 id="table-of-contents" className="text-2xl font-bold mb-4">Table des matières</h2>
        <Card>
          <CardContent className="p-6">
            <ol className="list-decimal list-inside space-y-2">
              <li><a href="#dashboard-overview" className="text-blue-600 hover:underline">Aperçu du tableau de bord</a></li>
              <li><a href="#user-management" className="text-blue-600 hover:underline">Gestion des utilisateurs</a></li>
              <li><a href="#class-management" className="text-blue-600 hover:underline">Gestion des classes</a></li>
              <li><a href="#exam-oversight" className="text-blue-600 hover:underline">Supervision des examens</a></li>
              <li><a href="#system-analytics" className="text-blue-600 hover:underline">Analyses du système</a></li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 id="dashboard-overview" className="text-2xl font-bold mb-4">Aperçu du tableau de bord</h2>
        <p className="mb-4">
          En tant qu'administrateur, votre tableau de bord fournit une vue d'ensemble complète de l'ensemble du système :
        </p>
        {/*<div className="mb-4 rounded-md overflow-hidden border">*/}
          {/*<div className="bg-slate-100 dark:bg-slate-800 h-64 flex items-center justify-center">*/}
            <Image src="/docs/img.png" width="800" height="200" className="object-contain"  alt={""}/>
          {/*</div>*/}
        {/*</div>*/}
        <p className="mb-4">Le tableau de bord affiche :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Nombre total d'utilisateurs (étudiants, professeurs, administrateurs)</li>
          <li>Nombre total de classes</li>
          <li>Nombre total d'examens</li>
          <li>Activité récente sur la plateforme</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">Actions Rapides</h3>
        <p className="mb-4">Depuis votre tableau de bord, vous pouvez rapidement :</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 flex flex-col items-center text-center">
            <Users className="h-8 w-8 text-green-400 mb-2" />
            <h4 className="font-medium">Gérer les Utilisateurs</h4>
            <p className="text-sm text-muted-foreground">Ajouter, modifier ou supprimer des utilisateurs</p>
          </Card>
          <Card className="p-4 flex flex-col items-center text-center">
            <FileText className="h-8 w-8 text-yellow-400 mb-2" />
            <h4 className="font-medium">Créer un Examen</h4>
            <p className="text-sm text-muted-foreground">Concevoir de nouveaux examens</p>
          </Card>
          <Card className="p-4 flex flex-col items-center text-center">
            <GraduationCap className="h-8 w-8 text-blue-400 mb-2" />
            <h4 className="font-medium">Ajouter une Classe</h4>
            <p className="text-sm text-muted-foreground">Créer de nouvelles classes</p>
          </Card>
        </div>
      </div>

      <Separator />

      <div>
        <h2 id="user-management" className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h2>
        <p className="mb-4">
          Les administrateurs ont un contrôle complet sur les comptes des utilisateurs dans le système.
        </p>

        <h3 className="text-xl font-semibold mb-2">Affichage de Tous les Utilisateurs</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Accéder à <strong>Tableau de bord &gt; Utilisateurs</strong> à partir de la barre latérale</li>
          <li>La page des utilisateurs affiche tous les utilisateurs du système avec leurs rôles</li>
          <li>Utilisez la fonction de recherche pour trouver des utilisateurs spécifiques</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Création de Nouveaux Utilisateurs</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Sur la page des utilisateurs, cliquez sur le bouton <strong>Créer un Utilisateur</strong></li>
          <li>Remplissez les informations requises :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Nom complet</li>
              <li>Email</li>
              <li>Mot de passe</li>
              <li>Rôle (Étudiant, Professeur ou Administrateur)</li>
            </ul>
          </li>
          <li>Cliquez <strong>Créer</strong> pour ajouter l'utilisateur au système</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Modification des Informations de l'Utilisateur</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Cliquez sur le nom d'un utilisateur dans la liste des utilisateurs</li>
          <li>Mettez à jour les informations dans le formulaire</li>
          <li>Cliquez <strong>Enregistrer les Changements</strong> pour mettre à jour le profil de l'utilisateur</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Gestion des Rôles de l'Utilisateur</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Accéder au profil d'un utilisateur</li>
          <li>Utilisez la liste déroulante du rôle pour changer leur rôle</li>
          <li>Cliquez <strong>Enregistrer les Changements</strong> pour appliquer le nouveau rôle</li>
        </ol>
      </div>

      <Separator />

      <div>
        <h2 id="class-management" className="text-2xl font-bold mb-4">Gestion des Classes</h2>
        <p className="mb-4">
          Les administrateurs peuvent créer et gérer toutes les classes du système.
        </p>

        <h3 className="text-xl font-semibold mb-2">Création d'une Nouvelle Classe</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Accéder à <strong>Tableau de bord &gt; Classes &gt; Créer une Classe</strong></li>
          <li>Remplissez les détails de la classe :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Nom de la classe</li>
              <li>Description</li>
              <li>Dates de début et de fin</li>
              <li>Assigner un professeur</li>
            </ul>
          </li>
          <li>Cliquez <strong>Créer la Classe</strong> pour l'ajouter au système</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Gestion des Classes Existantes</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Accéder à <strong>Tableau de bord &gt; Classes</strong></li>
          <li>Afficher toutes les classes du système</li>
          <li>Cliquez sur le nom d'une classe pour afficher ses détails</li>
          <li>Depuis la page de détails de la classe, vous pouvez :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Modifier les informations de la classe</li>
              <li>Ajouter des étudiants à la classe</li>
              <li>Supprimer des étudiants de la classe</li>
              <li>Afficher les examens associés</li>
            </ul>
          </li>
        </ol>
      </div>

      <Separator />

      <div>
        <h2 id="exam-oversight" className="text-2xl font-bold mb-4">Supervision des Examens</h2>
        <p className="mb-4">
          Les administrateurs ont une supervision de tous les examens du système.
        </p>

        <h3 className="text-xl font-semibold mb-2">Affichage de Tous les Examens</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Accéder à <strong>Tableau de bord &gt; Examens</strong></li>
          <li>Afficher tous les examens créés par les professeurs</li>
          <li>Filtrer les examens par sujet ou statut</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Création d'Examens</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Accéder à <strong>Tableau de bord &gt; Examens &gt; Créer un Examen</strong></li>
          <li>Remplir les détails de l'examen :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Titre</li>
              <li>Sujet (SQL, Base de Données, Algorithmique, Programmation)</li>
              <li>Description</li>
              <li>Format</li>
              <li>Télécharger le fichier de l'examen</li>
              <li>Sélectionner la classe</li>
              <li>Définir la date de fin</li>
            </ul>
          </li>
          <li>Ajouter des questions et des valeurs de points</li>
          <li>Cliquez <strong>Créer</strong> pour ajouter l'examen</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Noter les Examens</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Accéder aux détails de l'examen</li>
          <li>Cliquez <strong>Noter les Examens</strong></li>
          <li>Sélectionner une soumission d'étudiant à noter</li>
          <li>Attribuer des scores manuellement ou utiliser la correction automatique</li>
          <li>Ajouter des commentaires pour l'étudiant</li>
          <li>Enregistrer les notes</li>
        </ol>
      </div>
    </div>
  )
} 