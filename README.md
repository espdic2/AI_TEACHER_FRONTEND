# ClassMatrix - Plateforme d'Apprentissage Intelligente

ClassMatrix est une plateforme éducative complète qui révolutionne la création, la gestion et l'évaluation des examens grâce à l'intelligence artificielle.

## 🚀 Fonctionnalités principales

- **Gestion des classes** - Créez et gérez facilement des classes, ajoutez des étudiants et suivez leur progression
- **Création d'examens** - Concevez des examens personnalisés avec différents types de questions et sujets
- **Correction automatique** - Évaluez les réponses des étudiants avec l'aide de l'IA
- **Suivi des résultats** - Analysez les performances avec des statistiques détaillées et des visualisations
- **Rôles utilisateurs** - Fonctionnalités adaptées pour administrateurs, professeurs et étudiants

## 🧠 Sujets techniques pris en charge

- SQL et bases de données
- Programmation (Python, etc.)
- Algorithmes et structures de données
- Et bien plus encore...

## 🛠️ Technologies utilisées

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Framer Motion, Lucide React
- **Backend**: API RESTful, Supabase
- **Authentification**: JWT
- **Visualisation**: Recharts

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ 
- npm, yarn ou pnpm

### Installation

1. Clonez le dépôt
   ```bash
   git clone https://github.com/imRYiUK/ai_teacher.git
   cd ai_teacher
   ```

2. Installez les dépendances
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. Configurez les variables d'environnement
   ```bash
   cp .env.example .env.local
   # Modifiez les variables dans .env.local selon votre configuration
   ```

4. Lancez le serveur de développement
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📚 Documentation

Une documentation complète est disponible à l'adresse [http://localhost:3000/docs](http://localhost:3000/docs) après le démarrage du serveur. Elle comprend :

- Guides pour administrateurs, professeurs et étudiants
- Documentation des fonctionnalités
- Tutoriels pour les tâches courantes

## 🏗️ Structure du projet

```
ai_teacher/
├── public/             # Fichiers statiques
├── src/
│   ├── app/            # Routes et pages Next.js
│   ├── components/     # Composants React réutilisables
│   ├── config/         # Fichiers de configuration
│   ├── hooks/          # Hooks React personnalisés
│   ├── lib/            # Utilitaires et fonctions
│   ├── providers/      # Providers React (contexte, etc.)
│   └── middleware.ts   # Middleware Next.js pour l'authentification
├── .env.example        # Exemple de variables d'environnement
└── package.json        # Dépendances et scripts
```

## 🔐 Authentification et autorisations

Le système utilise JWT pour l'authentification et implémente un contrôle d'accès basé sur les rôles :

- **Administrateurs** : Accès complet à toutes les fonctionnalités
- **Professeurs** : Gestion des classes, création d'examens, notation
- **Étudiants** : Accès aux examens assignés, consultation des résultats

## 🌐 Déploiement

Le projet peut être facilement déployé sur Vercel :

```bash
npm run build
npm run start
```

Pour un déploiement sur Vercel, connectez simplement votre dépôt GitHub à Vercel.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter à contact@classmatrix.com.

---

© 2023 ClassMatrix. Tous droits réservés.
