import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, BookOpen, FileCheck, Clock, Calendar } from "lucide-react"
import Image from "next/image";

export default function StudentDocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manuel de l'Étudiant</h1>
        <p className="text-muted-foreground mb-6">
          Ce guide vous aidera à naviguer dans vos cours, passer des examens et suivre votre progression académique.
        </p>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Accès étudiant</AlertTitle>
          <AlertDescription>
            En tant qu'étudiant, vous pouvez consulter vos classes inscrites, passer des examens et suivre vos performances académiques.
          </AlertDescription>
        </Alert>
      </div>

      <div>
        <h2 id="table-of-contents" className="text-2xl font-bold mb-4">Table des matières</h2>
        <Card>
          <CardContent className="p-6">
            <ol className="list-decimal list-inside space-y-2">
              <li><a href="#dashboard-overview" className="text-blue-600 hover:underline">Aperçu du tableau de bord</a></li>
              <li><a href="#taking-exams" className="text-blue-600 hover:underline">Passer des examens</a></li>
              <li><a href="#viewing-results" className="text-blue-600 hover:underline">Consulter les résultats</a></li>
              <li><a href="#class-information" className="text-blue-600 hover:underline">Informations sur les classes</a></li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 id="dashboard-overview" className="text-2xl font-bold mb-4">Aperçu du tableau de bord</h2>
        <p className="mb-4">
          Votre tableau de bord étudiant est votre point d'accès central à toutes vos activités académiques :
        </p>
            <Image src="/docs/img_2.png" width="800" height="200" className="object-contain"  alt={""}/>
        <p className="mb-4">Le tableau de bord affiche :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Vos classes inscrites</li>
          <li>Examens à venir</li>
          <li>Examens récemment notés</li>
          <li>Votre progression académique globale</li>
        </ul>
      </div>

      <Separator />

      <div>
        <h2 id="taking-exams" className="text-2xl font-bold mb-4">Passer des examens</h2>
        <p className="mb-4">
          En tant qu'étudiant, vous pouvez passer les examens qui vous sont assignés par vos professeurs.
        </p>

        <h3 className="text-xl font-semibold mb-2">Accéder aux examens</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Naviguez vers <strong>Tableau de bord &gt; Mes examens</strong></li>
          <li>Consultez la liste des examens disponibles</li>
          <li>Cliquez sur un examen pour commencer</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Interface d'examen</h3>
        <p className="mb-4">Pendant l'examen :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Lisez attentivement les instructions</li>
          <li>Répondez à chaque question</li>
          <li>Utilisez le bouton <strong>Suivant</strong> pour passer à la question suivante</li>
          <li>Utilisez le bouton <strong>Précédent</strong> pour revenir aux questions précédentes</li>
          <li>Surveillez le temps restant affiché en haut de l'écran</li>
          <li>Cliquez sur <strong>Soumettre</strong> lorsque vous avez terminé</li>
        </ul>

        <div className="my-6 rounded-md overflow-hidden border p-4 bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span>Conseils pour les examens</span>
          </h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Assurez-vous d'avoir une connexion Internet stable avant de commencer</li>
            <li>Ne rafraîchissez pas la page pendant l'examen</li>
            <li>Vos réponses sont sauvegardées automatiquement</li>
            <li>Gérez votre temps efficacement</li>
          </ul>
        </div>
      </div>

      <Separator />

      <div>
        <h2 id="viewing-results" className="text-2xl font-bold mb-4">Consulter les résultats</h2>
        <p className="mb-4">
          Après que votre professeur a noté votre examen, vous pouvez consulter vos résultats.
        </p>

        <h3 className="text-xl font-semibold mb-2">Accéder aux résultats</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Naviguez vers <strong>Tableau de bord &gt; Mes résultats</strong></li>
          <li>Consultez la liste des examens notés</li>
          <li>Cliquez sur un examen pour voir les détails</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Comprendre vos résultats</h3>
        <p className="mb-4">La page de résultats affiche :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Votre score total</li>
          <li>Les points obtenus pour chaque question</li>
          <li>Les commentaires du professeur</li>
          <li>Les réponses correctes (si activées par le professeur)</li>
          <li>Votre classement dans la classe (si activé)</li>
        </ul>
      </div>

      <Separator />

      <div>
        <h2 id="class-information" className="text-2xl font-bold mb-4">Informations sur les classes</h2>
        <p className="mb-4">
          Vous pouvez consulter les informations sur vos classes inscrites.
        </p>

        <h3 className="text-xl font-semibold mb-2">Accéder aux informations de classe</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Naviguez vers <strong>Tableau de bord &gt; Mes classes</strong></li>
          <li>Consultez la liste de vos classes inscrites</li>
          <li>Cliquez sur une classe pour voir ses détails</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Détails de la classe</h3>
        <p className="mb-4">La page de détails de la classe affiche :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Informations sur la classe (nom, description, dates)</li>
          <li>Nom du professeur</li>
          <li>Liste des examens associés</li>
          <li>Votre progression dans la classe</li>
          <li>Matériel de cours (si disponible)</li>
        </ul>
      </div>
    </div>
  )
} 