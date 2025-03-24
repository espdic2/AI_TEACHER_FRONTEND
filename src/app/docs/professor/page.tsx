import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, FileCheck, FileText, PencilLine } from "lucide-react"
import Image from "next/image";

export default function ProfessorDocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manuel du Professeur</h1>
        <p className="text-muted-foreground mb-6">
          Ce guide vous aidera à comprendre comment gérer vos classes, créer et noter des examens, et suivre les performances des étudiants.
        </p>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Privilèges du professeur</AlertTitle>
          <AlertDescription>
            En tant que professeur, vous pouvez créer et gérer des classes, concevoir des examens, noter les travaux des étudiants et suivre leurs performances.
          </AlertDescription>
        </Alert>
      </div>

      <div>
        <h2 id="table-of-contents" className="text-2xl font-bold mb-4">Table des matières</h2>
        <Card>
          <CardContent className="p-6">
            <ol className="list-decimal list-inside space-y-2">
              <li><a href="#dashboard-overview" className="text-blue-600 hover:underline">Aperçu du tableau de bord</a></li>
              <li><a href="#class-management" className="text-blue-600 hover:underline">Gestion des classes</a></li>
              <li><a href="#exam-creation" className="text-blue-600 hover:underline">Création d'examens</a></li>
              <li><a href="#grading-assessment" className="text-blue-600 hover:underline">Notation et évaluation</a></li>
              <li><a href="#student-performance" className="text-blue-600 hover:underline">Suivi des performances des étudiants</a></li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 id="dashboard-overview" className="text-2xl font-bold mb-4">Aperçu du tableau de bord</h2>
        <p className="mb-4">
          En tant que professeur, votre tableau de bord fournit un aperçu rapide de vos activités d'enseignement :
        </p>
        <div className="mb-4 rounded-md overflow-hidden border">
          {/*<div className="bg-slate-100 dark:bg-slate-800 h-64 flex items-center justify-center">*/}
          {/*  [Capture d'écran du tableau de bord professeur]*/}
          {/*</div>*/}

          <Image src="/docs/img_1.png" width="800" height="200" className="object-contain"  alt={""}/>
        </div>
        <p className="mb-4">Le tableau de bord affiche :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Nombre de classes que vous enseignez</li>
          <li>Nombre total d'étudiants</li>
          <li>Examens en attente de notation</li>
          <li>Scores moyens des étudiants</li>
        </ul>
      </div>

      <Separator />

      <div>
        <h2 id="class-management" className="text-2xl font-bold mb-4">Gestion des classes</h2>
        <p className="mb-4">
          Les professeurs peuvent consulter et gérer les classes qu'ils enseignent.
        </p>

        <h3 className="text-xl font-semibold mb-2">Consulter vos classes</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Naviguez vers <strong>Tableau de bord &gt; Mes classes</strong> depuis la barre latérale</li>
          <li>Consultez toutes les classes qui vous sont assignées</li>
          <li>Cliquez sur le nom d'une classe pour voir ses détails</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Détails de la classe</h3>
        <p className="mb-4">Sur la page de détails de la classe, vous pouvez :</p>
        <ol className="list-decimal list-inside mb-4">
          <li>Consulter les informations de la classe (nom, description, dates)</li>
          <li>Voir la liste des étudiants inscrits</li>
          <li>Consulter les examens associés à la classe</li>
          <li>Suivre les indicateurs de performance de la classe</li>
        </ol>
      </div>

      <Separator />

      <div>
        <h2 id="exam-creation" className="text-2xl font-bold mb-4">Création d'examens</h2>
        <p className="mb-4">
          Les professeurs peuvent créer et gérer des examens pour leurs classes.
        </p>

        <h3 className="text-xl font-semibold mb-2">Créer un nouvel examen</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Naviguez vers <strong>Tableau de bord &gt; Mes examens &gt; Créer un examen</strong></li>
          <li>Remplissez les détails de l'examen :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Titre</li>
              <li>Matière (SQL, Base de données, Algorithme, Programmation)</li>
              <li>Description</li>
              <li>Format (PDF, etc.)</li>
              <li>Télécharger le fichier d'examen</li>
              <li>Sélectionner la classe</li>
              <li>Définir la date de fin</li>
            </ul>
          </li>
          <li>Ajoutez des questions et attribuez des valeurs en points</li>
          <li>Cliquez sur <strong>Enregistrer comme brouillon</strong> pour sauvegarder pour plus tard, ou <strong>Publier</strong> pour le rendre disponible aux étudiants</li>
        </ol>

        <div className="my-6 rounded-md overflow-hidden border p-4 bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-medium mb-2">Options de gestion des examens</h4>
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-sm bg-white dark:bg-slate-700 px-3 py-1 rounded-md shadow-sm">
              <PencilLine className="h-4 w-4 text-blue-500" />
              <span>Modifier</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-white dark:bg-slate-700 px-3 py-1 rounded-md shadow-sm">
              <FileCheck className="h-4 w-4 text-green-500" />
              <span>Noter les examens</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-white dark:bg-slate-700 px-3 py-1 rounded-md shadow-sm">
              <FileText className="h-4 w-4 text-amber-500" />
              <span>Voir les soumissions</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Gérer les examens existants</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Naviguez vers <strong>Tableau de bord &gt; Mes examens</strong></li>
          <li>Consultez tous les examens que vous avez créés</li>
          <li>Filtrez les examens par matière ou statut</li>
          <li>Cliquez sur un examen pour voir ses détails, le modifier ou noter les soumissions</li>
        </ol>
      </div>

      <Separator />

      <div>
        <h2 id="grading-assessment" className="text-2xl font-bold mb-4">Notation et évaluation</h2>
        <p className="mb-4">
          Les professeurs peuvent noter les soumissions d'examens des étudiants.
        </p>

        <h3 className="text-xl font-semibold mb-2">Notation manuelle</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Naviguez vers la page de détails d'un examen</li>
          <li>Cliquez sur <strong>Noter les examens</strong></li>
          <li>Sélectionnez une soumission d'étudiant à noter</li>
          <li>Examinez leurs réponses</li>
          <li>Attribuez des scores pour chaque question</li>
          <li>Ajoutez des commentaires pour l'étudiant</li>
          <li>Enregistrez les notes</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Correction automatique</h3>
        <p className="mb-4">Pour les types d'examens pris en charge :</p>
        <ol className="list-decimal list-inside mb-4">
          <li>Naviguez vers la page de notation</li>
          <li>Cliquez sur <strong>Correction automatique</strong> pour noter automatiquement la soumission</li>
          <li>Examinez les scores suggérés</li>
          <li>Effectuez les ajustements nécessaires</li>
          <li>Enregistrez les notes finales</li>
        </ol>
      </div>

      <Separator />

      <div>
        <h2 id="student-performance" className="text-2xl font-bold mb-4">Suivi des performances des étudiants</h2>
        <p className="mb-4">
          Les professeurs peuvent suivre les performances des étudiants dans leurs classes.
        </p>

        <h3 className="text-xl font-semibold mb-2">Performance de la classe</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Naviguez vers la page de détails d'une classe</li>
          <li>Consultez l'onglet performance pour voir :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Scores moyens</li>
              <li>Taux de complétion</li>
              <li>Progression individuelle des étudiants</li>
            </ul>
          </li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Analyses d'examen</h3>
        <p className="mb-4">Pour chaque examen :</p>
        <ol className="list-decimal list-inside mb-4">
          <li>Naviguez vers la page de détails de l'examen</li>
          <li>Consultez des statistiques telles que :
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Score moyen</li>
              <li>Scores les plus élevés et les plus bas</li>
              <li>Difficulté des questions basée sur la performance des étudiants</li>
              <li>Taux de complétion</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  )
}