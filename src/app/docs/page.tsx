import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Users, FileText, BarChart, Layers } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Bienvenue dans la documentation complète de notre plateforme éducative.
          Ce guide vous aidera à comprendre et à utiliser toutes les fonctionnalités disponibles.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Pour les Administrateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Gérez les utilisateurs, les classes et supervisez l'ensemble de la plateforme.</p>
            <Link href="/docs/admin" className="text-sm text-blue-600 hover:underline">
              Lire le guide administrateur →
            </Link>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              Pour les Professeurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Créez des classes, concevez des examens et évaluez les travaux des étudiants.</p>
            <Link href="/docs/professor" className="text-sm text-blue-600 hover:underline">
              Lire le guide du professeur →
            </Link>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-600" />
              Pour les Étudiants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Accédez aux examens, soumettez vos réponses et consultez vos résultats.</p>
            <Link href="/docs/student" className="text-sm text-blue-600 hover:underline">
              Lire le guide de l'étudiant →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4">Fonctionnalités clés</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-indigo-600" />
                Système d'examen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Créez, passez et notez des examens avec différents types de questions.</p>
              <Link href="/docs/features/exam-system" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                En savoir plus →
              </Link>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-5 w-5 text-purple-600" />
                Gestion des classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Créez et gérez des classes, inscrivez des étudiants et suivez leur progression.</p>
              <Link href="/docs/features/class-management" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                En savoir plus →
              </Link>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart className="h-5 w-5 text-emerald-600" />
                Analytique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Analyses complètes et rapports sur les performances des étudiants.</p>
              <Link href="/docs/features/analytics" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                En savoir plus →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Pour commencer</h2>
        <Card>
          <CardContent className="p-6">
            <ol className="space-y-4 list-decimal list-inside">
              <li>
                <Link href="/docs/overview" className="text-blue-600 hover:underline">
                  Aperçu de la plateforme
                </Link> - Comprendre l'architecture et les fonctionnalités de la plateforme
              </li>
              <li>
                <Link href="/docs/common/authentication" className="text-blue-600 hover:underline">
                  Authentification
                </Link> - Apprenez à vous connecter et à gérer votre compte
              </li>
              <li>
                <Link href="/docs/common/navigation" className="text-blue-600 hover:underline">
                  Navigation
                </Link> - Comprendre comment naviguer dans la plateforme
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 