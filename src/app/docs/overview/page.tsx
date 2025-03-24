import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PlatformOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Aperçu de la Plateforme</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Un aperçu complet de l'architecture et des fonctionnalités de notre plateforme éducative.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Architecture de la Plateforme</h2>
        <p>
          Notre plateforme éducative est construite avec des technologies modernes pour offrir une expérience fluide aux administrateurs, professeurs et étudiants.
          La plateforme se compose de plusieurs modules intégrés qui fonctionnent ensemble pour créer un environnement éducatif complet.
        </p>

        <div className="my-6 rounded-md overflow-hidden border">
          <div className="bg-slate-100 dark:bg-slate-800 h-64 flex items-center justify-center">
            [Diagramme d'Architecture de la Plateforme]
          </div>
        </div>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Modules Principaux</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Gestion des Utilisateurs</h4>
              <p className="text-sm text-muted-foreground">
                Gère l'authentification, l'autorisation et la gestion des profils pour tous les rôles d'utilisateurs.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Gestion des Classes</h4>
              <p className="text-sm text-muted-foreground">
                Gère la création de classes, l'inscription des étudiants et la planification des classes.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Système d'Examen</h4>
              <p className="text-sm text-muted-foreground">
                Gère la création, la distribution, la soumission et la notation des examens.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Moteur d'Analytique</h4>
              <p className="text-sm text-muted-foreground">
                Fournit des informations sur les performances des étudiants, les statistiques des classes et l'utilisation du système.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Rôles des Utilisateurs</h2>
        <p>
          La plateforme prend en charge trois rôles d'utilisateurs principaux, chacun avec des permissions et des capacités spécifiques.
        </p>

        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="admin">Administrateur</TabsTrigger>
            <TabsTrigger value="professor">Professeur</TabsTrigger>
            <TabsTrigger value="student">Étudiant</TabsTrigger>
          </TabsList>
          <TabsContent value="admin" className="p-4 border rounded-md mt-2">
            <h4 className="font-medium mb-2">Rôle d'Administrateur</h4>
            <p className="mb-2">Les administrateurs ont un accès complet à la plateforme et peuvent :</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Gérer tous les utilisateurs (créer, modifier, supprimer)</li>
              <li>Créer et gérer des classes</li>
              <li>Superviser tous les examens</li>
              <li>Accéder à l'analytique de l'ensemble du système</li>
              <li>Configurer les paramètres de la plateforme</li>
            </ul>
          </TabsContent>
          <TabsContent value="professor" className="p-4 border rounded-md mt-2">
            <h4 className="font-medium mb-2">Rôle de Professeur</h4>
            <p className="mb-2">Les professeurs peuvent gérer leurs classes et examens :</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Consulter et gérer les classes assignées</li>
              <li>Créer et modifier des examens</li>
              <li>Noter les soumissions des étudiants</li>
              <li>Consulter l'analytique des classes et des étudiants</li>
              <li>Communiquer avec les étudiants</li>
            </ul>
          </TabsContent>
          <TabsContent value="student" className="p-4 border rounded-md mt-2">
            <h4 className="font-medium mb-2">Rôle d'Étudiant</h4>
            <p className="mb-2">Les étudiants peuvent participer aux classes et passer des examens :</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Consulter les classes inscrites</li>
              <li>Passer les examens assignés</li>
              <li>Consulter les notes et les commentaires</li>
              <li>Suivre leur progression académique personnelle</li>
              <li>Mettre à jour leur profil personnel</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Fonctionnalités Clés</h2>
        <p>
          Notre plateforme offre un ensemble complet de fonctionnalités conçues pour améliorer l'expérience éducative.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Création d'Examens</h4>
              <p className="text-sm text-muted-foreground">
                Créez des examens avec différents types de questions, y compris à choix multiples, à réponse courte et questions de programmation.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Notation Automatique</h4>
              <p className="text-sm text-muted-foreground">
                Notez automatiquement certains types de questions pour gagner du temps et fournir un retour immédiat.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Analytique de Performance</h4>
              <p className="text-sm text-muted-foreground">
                Suivez les performances des étudiants avec des analyses détaillées et des visualisations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Gestion des Classes</h4>
              <p className="text-sm text-muted-foreground">
                Créez et gérez des classes, inscrivez des étudiants et suivez la progression des classes.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Gestion des Utilisateurs</h4>
              <p className="text-sm text-muted-foreground">
                Gérez les utilisateurs avec différents rôles et permissions.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Design Responsive</h4>
              <p className="text-sm text-muted-foreground">
                Accédez à la plateforme depuis n'importe quel appareil avec un design responsive qui s'adapte à différentes tailles d'écran.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 