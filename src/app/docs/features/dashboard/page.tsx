import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, LayoutDashboard, Users, GraduationCap, BookOpen, BarChart } from "lucide-react"
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Comprendre l'interface du tableau de bord et ses fonctionnalités.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Aperçu</h2>
        <p>
          Le tableau de bord est le point central de notre plateforme éducative. Il fournit un accès rapide à toutes les fonctionnalités
          et affiche des informations pertinentes adaptées à votre rôle d'utilisateur.
        </p>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Tableaux de bord spécifiques aux rôles</AlertTitle>
          <AlertDescription>
            Chaque rôle d'utilisateur dispose d'un tableau de bord personnalisé qui affiche des informations pertinentes et fournit
            un accès rapide aux fonctionnalités spécifiques au rôle.
          </AlertDescription>
        </Alert>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Tableau de bord administrateur</h2>


        <Image src="/docs/img.png" width="800" height="200" className="object-contain"  alt={""}/>
        
        <p>Le tableau de bord administrateur comprend :</p>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Gestion des utilisateurs</h3>
              </div>
              <p className="text-sm">
                Accès rapide pour ajouter, modifier ou supprimer des utilisateurs. Affiche également le nombre total d'utilisateurs par rôle.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Gestion des classes</h3>
              </div>
              <p className="text-sm">
                Créez et gérez des classes, assignez des professeurs et des étudiants, et surveillez l'activité des classes.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <LayoutDashboard className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Supervision du système</h3>
              </div>
              <p className="text-sm">
                Surveillez l'activité globale du système, y compris les connexions récentes et l'utilisation des ressources.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <BarChart className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold">Analyses et rapports</h3>
              </div>
              <p className="text-sm">
                Accédez à des analyses détaillées sur les performances des étudiants, l'utilisation du système et plus encore.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Tableau de bord professeur</h2>


        <Image src="/docs/img_1.png" width="800" height="200" className="object-contain"  alt={""}/>
        
        <p>Le tableau de bord professeur comprend :</p>
        
        <ul className="list-disc list-inside space-y-2">
          <li>Vue d'ensemble des classes enseignées</li>
          <li>Examens récemment créés et à noter</li>
          <li>Performances moyennes des étudiants</li>
          <li>Accès rapide pour créer de nouveaux examens</li>
          <li>Notifications pour les soumissions d'examens en attente</li>
        </ul>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Tableau de bord étudiant</h2>

        <Image src="/docs/img_2.png" width="800" height="200" className="object-contain"  alt={""}/>
        
        <p>Le tableau de bord étudiant comprend :</p>
        
        <ul className="list-disc list-inside space-y-2">
          <li>Classes inscrites</li>
          <li>Examens à venir avec dates d'échéance</li>
          <li>Examens récemment notés avec scores</li>
          <li>Progression académique globale</li>
          <li>Notifications pour les nouveaux examens assignés</li>
        </ul>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Personnalisation du tableau de bord</h2>
        <p>
          Tous les utilisateurs peuvent personnaliser certains aspects de leur tableau de bord :
        </p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Cliquez sur l'icône <strong>Paramètres</strong> dans le coin supérieur droit du tableau de bord</li>
          <li>Sélectionnez <strong>Personnaliser le tableau de bord</strong></li>
          <li>Choisissez les widgets à afficher ou à masquer</li>
          <li>Réorganisez les widgets selon vos préférences</li>
          <li>Enregistrez vos modifications</li>
        </ol>
      </div>
    </div>
  )
} 