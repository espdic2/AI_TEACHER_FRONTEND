import { SidebarNavItem } from "@/types/docs"

interface DocsConfig {
  mainNav: { title: string; href: string }[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Plateforme",
      href: "/",
    },
  ],
  sidebarNav: [
    {
      title: "Démarrage",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Aperçu de la plateforme",
          href: "/docs/overview",
        },
      ],
    },
    {
      title: "Guides utilisateurs",
      items: [
        {
          title: "Guide administrateur",
          href: "/docs/admin",
        },
        {
          title: "Guide professeur",
          href: "/docs/professor",
        },
        {
          title: "Guide étudiant",
          href: "/docs/student",
        },
      ],
    },
    {
      title: "Fonctionnalités",
      items: [
        {
          title: "Tableau de bord",
          href: "/docs/features/dashboard",
        },
        {
          title: "Gestion des utilisateurs",
          href: "/docs/features/user-management",
        },
        {
          title: "Gestion des classes",
          href: "/docs/features/class-management",
        },
        {
          title: "Système d'examen",
          href: "/docs/features/exam-system",
        },
        {
          title: "Notation & Évaluation",
          href: "/docs/features/grading",
        },
        {
          title: "Analytique",
          href: "/docs/features/analytics",
        },
      ],
    },
    {
      title: "Tâches courantes",
      items: [
        {
          title: "Authentification",
          href: "/docs/common/authentication",
        },
        {
          title: "Gestion du profil",
          href: "/docs/common/profile",
        },
        {
          title: "Navigation",
          href: "/docs/common/navigation",
        },
      ],
    },
  ],
} 