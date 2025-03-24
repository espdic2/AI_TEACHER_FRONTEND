import { Separator } from "@/components/ui/separator"
import {Menu, Home} from "lucide-react"
import Image from "next/image";

export default function NavigationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Navigation</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Guide pour naviguer efficacement dans la plateforme.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Structure de la plateforme</h2>
        <p>
          Notre plateforme est organisée de manière intuitive pour vous aider à trouver rapidement ce dont vous avez besoin.
          La navigation principale est cohérente sur toutes les pages.
        </p>


        <Image src="/docs/img_8.png" width="200" height="50" className="object-contain"  alt={""}/>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Barre de navigation principale</h2>
        
        <p>La barre de navigation principale se trouve en haut de chaque page et contient :</p>
        
        <ul className="list-disc list-inside space-y-2">
          <li>Logo de la plateforme (cliquez pour revenir à l'accueil)</li>
          <li>Liens vers les sections principales</li>
          <li>Barre de recherche</li>
          <li>Icône de notifications</li>
          <li>Menu utilisateur (avatar/nom)</li>
        </ul>
        
        <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800 mt-4">
          <Home className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm">
            Vous pouvez toujours revenir à la page d'accueil en cliquant sur le logo de la plateforme dans le coin supérieur gauche.
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Barre latérale</h2>
        <p>
          La barre latérale contient des liens vers les fonctionnalités spécifiques à votre rôle :
        </p>
        
        <h3 className="text-xl font-semibold mb-2">Pour les administrateurs</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Tableau de bord</li>
          <li>Gestion des utilisateurs</li>
          <li>Gestion des classes</li>
          <li>Analyses du système</li>
          <li>Paramètres</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-2">Pour les professeurs</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Tableau de bord</li>
          <li>Mes classes</li>
          <li>Mes examens</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-2">Pour les étudiants</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Tableau de bord</li>
          <li>Mes classes</li>
          <li>Mes examens</li>
          <li>Mes résultats</li>
        </ul>
        
        <div className="flex items-center gap-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-md border mt-4">
          <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
          <p className="text-sm">
            Sur les appareils mobiles, la barre latérale est masquée par défaut. Vous pouvez l'ouvrir en cliquant sur l'icône de menu dans le coin supérieur gauche.
          </p>
        </div>
      </div>
    </div>
  )
} 