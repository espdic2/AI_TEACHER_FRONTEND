import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, GraduationCap, Users, Calendar, BookOpen } from "lucide-react"
import Image from "next/image";

export default function ClassManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Gestion des Classes</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Guide complet pour créer et gérer des classes sur la plateforme.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Aperçu</h2>
        <p>
          Le système de gestion des classes permet aux administrateurs et aux professeurs de créer et gérer des classes,
          d'inscrire des étudiants, de planifier des sessions et de suivre les performances des classes.
        </p>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Accès basé sur les rôles</AlertTitle>
          <AlertDescription>
            Les administrateurs peuvent créer et gérer toutes les classes. Les professeurs peuvent gérer leurs classes assignées.
            Les étudiants peuvent consulter les classes auxquelles ils sont inscrits.
          </AlertDescription>
        </Alert>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Création de Classes</h2>
        <p>
          Les administrateurs et les professeurs peuvent créer de nouvelles classes sur la plateforme.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Processus de Création de Classe</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers <strong>Tableau de bord &gt; Classes &gt; Créer une Classe</strong></li>
          <li>Remplissez les détails de la classe :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Nom de la classe</li>
              <li>Description</li>
              <li>Domaine du sujet</li>
              <li>Dates de début et de fin</li>
              <li>Inscription maximale (optionnel)</li>
            </ul>
          </li>
          <li>Assignez des professeurs à la classe</li>
          <li>Cliquez sur <strong>Créer la Classe</strong> pour finaliser</li>
        </ol>

        <Image src="/docs/img_3.png" width="800" height="200" className="object-contain"  alt={""}/>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Gestion des Étudiants</h2>
        <p>
          Inscrivez et gérez les étudiants dans vos classes.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Inscription des Étudiants</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers la page de détails de la classe</li>
          <li>Sélectionnez l'onglet <strong>Étudiants</strong></li>
          <li>Cliquez sur <strong>Inscrire des Étudiants</strong></li>
          <li>Recherchez des étudiants par nom ou email</li>
          <li>Sélectionnez les étudiants à inscrire</li>
          <li>Cliquez sur <strong>Inscrire les Étudiants Sélectionnés</strong></li>
        </ol>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Gestion des Inscriptions</h3>
        <p className="mb-4">Depuis l'onglet Étudiants, vous pouvez :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Voir tous les étudiants inscrits</li>
          <li>Retirer des étudiants de la classe</li>
          <li>Exporter la liste des étudiants</li>
          <li>Envoyer des annonces à tous les étudiants</li>
        </ul>

        <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-400">Inscription en Masse</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Pour les grandes classes, vous pouvez utiliser la fonctionnalité d'inscription en masse pour inscrire plusieurs étudiants à la fois.
                Téléchargez un fichier CSV avec les emails des étudiants pour les inscrire rapidement à la classe.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Contenu de la Classe</h2>
        <p>
          Gérez le contenu et les ressources pour vos classes.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Ajout d'Examens</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers la page de détails de la classe</li>
          <li>Sélectionnez l'onglet <strong>Examens</strong></li>
          <li>Cliquez sur <strong>Ajouter un Examen</strong></li>
          <li>Créez un nouvel examen ou sélectionnez un examen existant</li>
          <li>Définissez les dates de disponibilité pour l'examen</li>
          <li>Cliquez sur <strong>Ajouter à la Classe</strong></li>
        </ol>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Emploi du Temps de la Classe</h3>
        <p className="mb-4">Gérez l'emploi du temps de la classe :</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers la page de détails de la classe</li>
          <li>Sélectionnez l'onglet <strong>Emploi du Temps</strong></li>
          <li>Ajoutez des sessions avec dates, heures et sujets</li>
          <li>Les étudiants verront l'emploi du temps dans leur vue de classe</li>
        </ol>

        <div className="my-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-400">Conseils pour l'Emploi du Temps</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Créez un emploi du temps cohérent pour vos sessions de classe. Incluez des sujets clairs pour chaque session
                afin d'aider les étudiants à se préparer. Vous pouvez également ajouter des liens vers des ressources ou du matériel pour chaque session.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Analytique de Classe</h2>
        <p>
          Suivez les performances de la classe et l'engagement des étudiants.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Métriques de Performance</h3>
        <p className="mb-4">Consultez l'analytique pour votre classe :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Performance globale de la classe</li>
          <li>Taux de complétion des examens</li>
          <li>Scores moyens</li>
          <li>Métriques d'engagement des étudiants</li>
          <li>Tendances de performance au fil du temps</li>
        </ul>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Progression Individuelle des Étudiants</h3>
        <p className="mb-4">Suivez la progression des étudiants individuels :</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers la page de détails de la classe</li>
          <li>Sélectionnez l'onglet <strong>Étudiants</strong></li>
          <li>Cliquez sur le nom d'un étudiant pour voir sa progression détaillée</li>
          <li>Consultez ses scores aux examens, statut de complétion et métriques d'engagement</li>
        </ol>
      </div>
    </div>
  )
} 