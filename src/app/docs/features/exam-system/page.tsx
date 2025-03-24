import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, FileText, CheckCircle, Clock, Database, Code, BarChart3 } from "lucide-react"

export default function ExamSystemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Système d'Examen</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Un guide complet pour créer, passer et noter des examens sur notre plateforme.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Aperçu</h2>
        <p>
          Notre système d'examen est conçu pour répondre à divers besoins d'évaluation éducative. Il permet aux professeurs de créer
          différents types d'examens, aux étudiants de les passer, et fournit des outils pour une notation et un retour efficaces.
        </p>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Accès basé sur les rôles</AlertTitle>
          <AlertDescription>
            Différents rôles d'utilisateurs ont différentes capacités au sein du système d'examen. Les administrateurs et les professeurs peuvent créer et noter des examens,
            tandis que les étudiants ne peuvent passer que les examens qui leur sont assignés.
          </AlertDescription>
        </Alert>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Types d'examens pris en charge</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Examens à choix multiples</h3>
              </div>
              <p className="text-sm">
                Créez des questions à choix multiples avec une ou plusieurs réponses correctes. Idéal pour les tests de connaissances.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Examens SQL</h3>
              </div>
              <p className="text-sm">
                Créez des questions qui demandent aux étudiants d'écrire des requêtes SQL. Les réponses sont vérifiées automatiquement.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Examens de programmation</h3>
              </div>
              <p className="text-sm">
                Créez des questions de programmation où les étudiants écrivent du code qui est exécuté et testé automatiquement.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold">Examens mixtes</h3>
              </div>
              <p className="text-sm">
                Combinez différents types de questions dans un seul examen pour une évaluation complète des compétences.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Création d'examens</h2>
        <p>
          Les professeurs et les administrateurs peuvent créer des examens en suivant ces étapes :
        </p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers <strong>Tableau de bord &gt; Examens &gt; Créer un examen</strong></li>
          <li>Remplissez les détails de base de l'examen (titre, description, durée)</li>
          <li>Sélectionnez le type d'examen</li>
          <li>Ajoutez des questions et définissez les points pour chaque question</li>
          <li>Configurez les paramètres de l'examen (date de début/fin, tentatives autorisées)</li>
          <li>Assignez l'examen à une ou plusieurs classes</li>
          <li>Publiez l'examen ou enregistrez-le comme brouillon</li>
        </ol>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Passage d'examens</h2>
        <p>
          Les étudiants peuvent passer les examens qui leur sont assignés :
        </p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers <strong>Tableau de bord &gt; Mes examens</strong></li>
          <li>Sélectionnez un examen disponible</li>
          <li>Lisez les instructions et commencez l'examen</li>
          <li>Répondez à toutes les questions</li>
          <li>Soumettez l'examen avant la fin du temps imparti</li>
        </ol>
        
        <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
          <Clock className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm">
            Une fois qu'un examen est commencé, un minuteur apparaît pour indiquer le temps restant. L'examen est automatiquement soumis lorsque le temps est écoulé.
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Notation et évaluation</h2>
        <p>
          Les professeurs peuvent noter les examens soumis :
        </p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers <strong>Tableau de bord &gt; Mes examens</strong></li>
          <li>Sélectionnez un examen avec des soumissions en attente</li>
          <li>Cliquez sur <strong>Noter les examens</strong></li>
          <li>Sélectionnez une soumission d'étudiant</li>
          <li>Attribuez des points pour chaque réponse</li>
          <li>Ajoutez des commentaires pour l'étudiant</li>
          <li>Enregistrez les notes</li>
        </ol>
        
        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm">
            Pour les examens à choix multiples et certains types d'examens de programmation, la notation automatique est disponible pour accélérer le processus d'évaluation.
          </p>
        </div>
      </div>
    </div>
  )
} 