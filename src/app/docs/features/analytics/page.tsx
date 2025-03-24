import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { PieChart, BarChart, LineChart } from "lucide-react"
import Image from "next/image";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Analytique</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Comprendre les données et les performances sur la plateforme.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Aperçu</h2>
        <p>
          Notre plateforme offre des analyses détaillées pour aider les administrateurs, les professeurs et les étudiants
          à suivre les performances et à prendre des décisions éclairées.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium">Analytique des classes</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Suivez les performances des classes, l'engagement des étudiants et les tendances au fil du temps.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart className="h-5 w-5 text-indigo-500" />
                <h4 className="font-medium">Analytique des examens</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Suivez la distribution des statuts d'examen, les taux de complétion et les métriques de performance globale.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart className="h-5 w-5 text-emerald-500" />
                <h4 className="font-medium">Métriques de performance</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Consultez les scores moyens de toutes les classes, les taux de complétion et les tendances de performance.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="h-5 w-5 text-amber-500" />
                <h4 className="font-medium">Utilisation du système</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Surveillez les modèles d'utilisation de la plateforme, les heures de pointe et l'utilisation des ressources.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Analytique pour administrateurs</h2>
        <p>
          Les administrateurs peuvent accéder à des analyses complètes pour surveiller l'ensemble de la plateforme.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Analytique des classes</h3>
        <p className="mb-4">Pour toutes les classes, les administrateurs peuvent voir :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Nombre total de classes actives</li>
          <li>Distribution des classes par département</li>
          <li>Taux d'engagement des étudiants</li>
          <li>Performances moyennes des classes</li>
          <li>Comparaisons entre les classes</li>
        </ul>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Analytique des examens</h3>
        <p className="mb-4">Pour tous les examens, les administrateurs peuvent voir :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Nombre total d'examens créés</li>
          <li>Distribution des statuts d'examen (brouillon, publié, terminé)</li>
          <li>Taux de complétion des examens</li>
          <li>Scores moyens globaux</li>
          <li>Types d'examens les plus utilisés</li>
        </ul>

        <Image src="/docs/img_5.png" width="800" height="200" className="object-contain"  alt={""}/>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Analytique pour professeurs</h2>
        <p>
          Les professeurs peuvent accéder à l'analytique de leurs classes et examens pour suivre les performances des étudiants.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Analytique des classes</h3>
        <p className="mb-4">Pour chaque classe, les professeurs peuvent voir :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Métriques de performance globale de la classe</li>
          <li>Engagement et participation des étudiants</li>
          <li>Taux de complétion des examens</li>
          <li>Distribution des notes</li>
          <li>Tendances de performance au fil du temps</li>
        </ul>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Analytique des examens</h3>
        <p className="mb-4">Pour chaque examen, les professeurs peuvent voir :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Score moyen et distribution des scores</li>
          <li>Analyse de performance question par question</li>
          <li>Statistiques de temps de complétion</li>
          <li>Questions difficiles identifiées par des taux de réussite faibles</li>
          <li>Comparaison avec les examens précédents</li>
        </ul>

        <Image src="/docs/img_2.png" width="800" height="200" className="object-contain"  alt={""}/>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Analytique pour étudiants</h2>
        <p>
          Les étudiants peuvent consulter leur analytique de performance personnelle pour suivre leur progression.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Performance personnelle</h3>
        <p className="mb-4">Les étudiants peuvent voir :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Moyenne générale des notes</li>
          <li>Performance par matière ou classe</li>
          <li>Progression au fil du temps</li>
          <li>Points forts et domaines à améliorer</li>
          <li>Comparaison avec la moyenne de la classe (anonymisée)</li>
        </ul>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Résultats d'examen</h3>
        <p className="mb-4">Pour chaque examen complété, les étudiants peuvent voir :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Score global et note</li>
          <li>Analyse détaillée question par question</li>
          <li>Réponses correctes et explications (si activées par le professeur)</li>
          <li>Commentaires du professeur</li>
          <li>Comparaison avec la moyenne de la classe (anonymisée)</li>
        </ul>

        <Image src="/docs/img_3.png" width="800" height="200" className="object-contain"  alt={""}/>

        <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <PieChart className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-400">Utiliser l'analytique pour s'améliorer</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Les étudiants devraient régulièrement consulter leur analytique de performance pour identifier les domaines à améliorer.
                Concentrez-vous sur les matières ou types de questions où la performance est inférieure à la moyenne.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 