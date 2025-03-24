"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  FileText, 
  BarChart3, 
  Sparkles,
  Database,
  Code
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Helper function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expirationTime = payload.exp * 1000 // Convert to milliseconds
      return Date.now() >= expirationTime
    } catch (error) {
      return true // If we can't decode the token, consider it expired
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 z-0" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="flex-1 space-y-6"
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
            >
              <Badge className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-4">
                Plateforme d'apprentissage intelligente
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                ClassMatrix: Révolutionnez l'éducation avec l'IA
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                Une plateforme complète pour créer, gérer et évaluer des examens avec l'aide de l'intelligence artificielle.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30"
                  onClick={() => router.push('/auth/login')}
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  onClick={() => router.push('/docs')}
                >
                  Voir la documentation
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-blue-100 dark:border-blue-900">
                <Image
                  src="/auto_test.jpg"
                  alt="Platform Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              
              {/* Badge pour grands écrans */}
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Correction automatique</p>
                    <p className="text-sm text-muted-foreground">Alimentée par l'IA</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Badge pour petits écrans */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg mt-8 mb-4 md:hidden">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">Correction automatique</p>
                  <p className="text-sm text-muted-foreground">Alimentée par l'IA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
              Fonctionnalités
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre plateforme offre des outils complets pour les administrateurs, professeurs et étudiants.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Feature 1 */}
            <motion.div variants={fadeIn}>
              <Card className="border-none shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-fit mb-4">
                    <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Gestion des Classes</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    Créez et gérez facilement des classes, ajoutez des étudiants et suivez leur progression.
                  </p>
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium hover:cursor-pointer" onClick={() => router.push('/docs/features/class-management')}>
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div variants={fadeIn}>
              <Card className="border-none shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] h-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-fit mb-4">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Création d'Examens</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    Concevez des examens personnalisés avec différents types de questions et sujets.
                  </p>
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium hover:cursor-pointer" onClick={() => router.push('/docs/features/exam-system')}>
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div variants={fadeIn}>
              <Card className="border-none shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] h-full bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full w-fit mb-4">
                    <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Suivi des Résultats</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    Analysez les performances des étudiants avec des statistiques détaillées et des visualisations.
                  </p>
                  <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 font-medium hover:cursor-pointer" onClick={() => router.push('/docs/features/grading')}>
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-3 py-1 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Sujets d'examens
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Couvrez tous les domaines techniques
              </h2>
              <p className="text-muted-foreground mb-8">
                Notre plateforme prend en charge une variété de sujets techniques pour répondre à tous vos besoins d'évaluation.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">SQL et Bases de données</p>
                    <p className="text-sm text-muted-foreground">Évaluez les compétences en requêtes et conception</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                    <Code className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium">Programmation</p>
                    <p className="text-sm text-muted-foreground">Testez les connaissances en développement logiciel</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium">Algorithmes</p>
                    <p className="text-sm text-muted-foreground">Évaluez la résolution de problèmes complexes</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex-1 grid grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="col-span-2">
                <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-white/20 text-white hover:bg-white/30">SQL</Badge>
                      <Database className="h-5 w-5 text-blue-200" />
                    </div>
                    <p className="text-sm font-mono bg-black/20 p-3 rounded-md">
                      SELECT * FROM students<br />
                      WHERE score &gt; 15<br />
                      ORDER BY name ASC;
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-none shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-white/20 text-white hover:bg-white/30">Python</Badge>
                    <Code className="h-5 w-5 text-emerald-200" />
                  </div>
                  <p className="text-sm font-mono bg-black/20 p-3 rounded-md">
                    def hello():<br />
                    &nbsp;&nbsp;print("Hello")
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-white/20 text-white hover:bg-white/30">Algo</Badge>
                    <BarChart3 className="h-5 w-5 text-amber-200" />
                  </div>
                  <p className="text-sm font-mono bg-black/20 p-3 rounded-md">
                    O(n log n)<br />
                    Quick Sort
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              Pour tous les utilisateurs
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Une solution pour chaque rôle</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Que vous soyez administrateur, professeur ou étudiant, notre plateforme s'adapte à vos besoins.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Admin */}
            <motion.div variants={fadeIn}>
              <Card className="border-none shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Administrateurs</h3>
                  </div>
                  
                  <ul className="space-y-3 mb-6 flex-grow">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Gestion complète des utilisateurs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Création et supervision des classes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Tableaux de bord analytiques</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Rapports de performance</span>
                    </li>
                  </ul>
                  
                  <Button variant="outline" className="w-full hover:cursor-pointer" onClick={() => router.push('/docs/admin')}>
                    En savoir plus
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Professor */}
            <motion.div variants={fadeIn}>
              <Card className="border-none shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                      <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Professeurs</h3>
                  </div>
                  
                  <ul className="space-y-3 mb-6 flex-grow">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Création d'examens personnalisés</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Gestion des classes et étudiants</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Correction assistée par IA</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Suivi des performances</span>
                    </li>
                  </ul>
                  
                  <Button variant="outline" className="w-full hover:cursor-pointer" onClick={() => router.push('/docs/professor')}>
                    En savoir plus
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Student */}
            <motion.div variants={fadeIn}>
              <Card className="border-none shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                      <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Étudiants</h3>
                  </div>
                  
                  <ul className="space-y-3 mb-6 flex-grow">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Accès aux examens assignés</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Interface intuitive de test</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Feedback immédiat</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Suivi de progression personnelle</span>
                    </li>
                  </ul>
                  
                  <Button variant="outline" className="w-full hover:cursor-pointer" onClick={() => router.push('/docs/student')}>
                    En savoir plus
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="relative rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0" />
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-0" />
            
            <div className="relative z-10 p-12 md:p-16 text-center">
              <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-medium">Commencez dès aujourd'hui</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
                Prêt à transformer votre approche pédagogique ?
              </h2>
              
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Rejoignez des milliers d'établissements qui utilisent notre plateforme pour améliorer leur enseignement et l'évaluation des étudiants.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-white/90"
                  onClick={() => router.push('/auth/login')}
                >
                  Commencer gratuitement
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/30 text-black hover:text-white hover:bg-white/10"
                  onClick={() => router.push('/docs')}
                >
                  Voir la documentation
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo />
              <p className="text-muted-foreground mb-4">
                Une solution complète pour la gestion des examens et l'évaluation des étudiants.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Fonctionnalités</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Tarifs</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Témoignages</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Guide d'utilisation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Communauté</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Assistance</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">À propos</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Carrières</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2023 ClassMatrix. Tous droits réservés.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}