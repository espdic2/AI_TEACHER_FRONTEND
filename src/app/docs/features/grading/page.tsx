import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, CheckCircle, FileCheck, BarChart3, MessageSquare } from "lucide-react"
import Image from "next/image";

export default function GradingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Notation</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Apprenez comment fonctionne la notation et comment évaluer la performance des étudiants.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Aperçu</h2>
        <p>
          Notre plateforme fournit des outils complets pour noter les examens et évaluer la performance des étudiants.
          Les professeurs peuvent noter manuellement ou utiliser des fonctionnalités de notation automatique pour certains types de questions.
        </p>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Privilèges du professeur</AlertTitle>
          <AlertDescription>
            Les fonctionnalités de notation sont principalement disponibles pour les professeurs. Les administrateurs peuvent également accéder aux
            fonctionnalités de notation, tandis que les étudiants peuvent uniquement consulter leurs notes et commentaires.
          </AlertDescription>
        </Alert>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Processus de Notation</h2>
        <p>
          Le processus de notation implique l'examen des soumissions des étudiants et l'attribution de scores basés sur des critères prédéfinis.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Accès aux Soumissions</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers <strong>Tableau de bord &gt; Mes Examens</strong></li>
          <li>Sélectionnez un examen qui a des soumissions d'étudiants</li>
          <li>Cliquez sur l'onglet <strong>Soumissions</strong></li>
          <li>Vous verrez une liste de toutes les soumissions d'étudiants avec leur statut</li>
          <li>Cliquez sur une soumission pour commencer la notation</li>
        </ol>

        <Image src="/docs/img_4.png" width="800" height="200" className="object-contain"  alt={""}/>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Notation Manuelle</h2>
        <p>
          La notation manuelle permet aux professeurs d'examiner chaque réponse et de fournir des commentaires personnalisés.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Interface de Notation</h3>
        <p className="mb-4">L'interface de notation affiche :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>L'énoncé de la question</li>
          <li>La réponse de l'étudiant</li>
          <li>La réponse correcte ou la grille d'évaluation (si fournie)</li>
          <li>Un champ de saisie pour le score</li>
          <li>Une zone de texte pour les commentaires</li>
        </ul>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Étapes de Notation</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Examinez la réponse de l'étudiant</li>
          <li>Comparez-la à la réponse correcte ou à la grille d'évaluation</li>
          <li>Attribuez un score basé sur la précision et l'exhaustivité</li>
          <li>Fournissez des commentaires constructifs</li>
          <li>Cliquez sur <strong>Enregistrer</strong> pour sauvegarder la note</li>
          <li>Passez à la question suivante</li>
        </ol>

        <div className="my-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-400">Bonnes Pratiques de Notation</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Soyez cohérent dans vos critères de notation pour tous les étudiants. Fournissez des commentaires spécifiques qui aident
                les étudiants à comprendre leurs erreurs et comment s'améliorer. Utilisez des grilles d'évaluation lorsqu'elles sont disponibles pour assurer l'équité.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Notation Automatique</h2>
        <p>
          Certains types de questions peuvent être notés automatiquement par le système.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Types de Questions Auto-Notables</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Questions à choix multiples</li>
          <li>Questions Vrai/Faux</li>
          <li>Requêtes SQL (avec des cas de test prédéfinis)</li>
          <li>Questions de programmation (avec des cas de test)</li>
          <li>Questions d'appariement</li>
        </ul>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Utilisation de la Notation Automatique</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers la page des soumissions de l'examen</li>
          <li>Cliquez sur <strong>Noter Automatiquement Tout</strong> pour noter toutes les soumissions</li>
          <li>Alternativement, ouvrez une soumission spécifique et cliquez sur <strong>Noter Automatiquement</strong></li>
          <li>Examinez les scores notés automatiquement</li>
          <li>Effectuez des ajustements si nécessaire</li>
          <li>Ajoutez des commentaires supplémentaires</li>
          <li>Cliquez sur <strong>Enregistrer</strong> pour finaliser les notes</li>
        </ol>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Limitations de la notation automatique</AlertTitle>
          <AlertDescription>
            La notation automatique fonctionne mieux pour les questions objectives avec des réponses clairement correctes/incorrectes. Pour les questions subjectives
            ou les réponses complexes, une révision manuelle est recommandée même après la notation automatique.
          </AlertDescription>
        </Alert>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Fournir des Commentaires</h2>
        <p>
          Des commentaires efficaces aident les étudiants à comprendre leurs erreurs et à améliorer leurs performances.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Directives pour les Commentaires</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Soyez spécifique sur ce qui était correct ou incorrect</li>
          <li>Expliquez pourquoi une réponse était fausse</li>
          <li>Fournissez des suggestions d'amélioration</li>
          <li>Utilisez un ton constructif et encourageant</li>
          <li>Référencez le matériel de cours ou les ressources lorsque c'est pertinent</li>
        </ul>

        <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-400">Exemples de Commentaires</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Au lieu de :</strong> "Mauvaise réponse."<br />
                <strong>Essayez :</strong> "Votre requête SQL manque une clause JOIN, c'est pourquoi elle ne renvoie pas les données de relation attendues. Revoyez la section sur les JOINs dans le chapitre 4."
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Publication des Notes</h2>
        <p>
          Une fois la notation terminée, les notes doivent être publiées pour que les étudiants puissent les consulter.
        </p>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Processus de Publication</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Naviguez vers la page de détails de l'examen</li>
          <li>Assurez-vous que toutes les soumissions sont notées</li>
          <li>Cliquez sur <strong>Publier les Notes</strong></li>
          <li>Confirmez l'action</li>
          <li>Les étudiants pourront maintenant voir leurs notes et commentaires</li>
        </ol>

        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Options de Visibilité des Notes</h3>
        <p className="mb-4">Lors de la publication des notes, vous pouvez choisir ce que les étudiants peuvent voir :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Score global uniquement</li>
          <li>Score et commentaires pour chaque question</li>
          <li>Réponses correctes</li>
          <li>Moyenne de la classe et statistiques</li>
        </ul>
      </div>
    </div>
  )
} 