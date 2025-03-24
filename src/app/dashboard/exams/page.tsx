// src/app/dashboard/exams/page.tsx
"use client"

import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { examService } from "@/services/examService";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Eye, Trash, Calendar, BookOpen, Award } from "lucide-react";
import { ExamStatus, Exam } from "@/types/exam";
import { DeleteExamDialog } from "@/components/ui/delete-exam-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Database,
  FileText,
  BarChart3,
  Filter,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Code
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export default function ExamsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [examToDelete, setExamToDelete] = useState<{ id: string; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        let data;
        if (user?.role === 'ADMIN') {
          data = await examService.getExams();
        } else if (user?.role === 'PROFESSOR') {
          data = await examService.getProfessorExams();
        }

        if (data) {
          setExams(data.reverse());
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des examens");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'PROFESSOR' || user?.role === 'ADMIN') {
      fetchExams();
    }
  }, [user?.role]);

  // Vérifier si l'utilisateur est un professeur
  if (user?.role !== 'PROFESSOR' && user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-xl font-semibold text-center">Accès non autorisé</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateExam = () => {
    router.push('/dashboard/exams/create');
  };

  const handleEditExam = (id: string) => {
    router.push(`/dashboard/exams/edit/${id}`);
  };

  const handleViewExam = (id: string) => {
    router.push(`/dashboard/exams/${id}`);
  };

  const handleDeleteExam = async (id: string) => {
    try {
      await examService.deleteExam(id);
      setExams(exams.filter(exam => exam.id !== id));
      toast.success("L'examen a été supprimé avec succès");
      setExamToDelete(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'examen");
    }
  };

  const toggleSubjectFilter = (type: string) => {
    setSelectedSubjects((prev) => 
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "Expiré";
    } else if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Demain";
    } else if (diffDays <= 3) {
      return `Dans ${diffDays} jours`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get exam type styling
  const getExamTypeStyle = (subject: string) => {
    switch(subject.toUpperCase()) {
      case 'SQL':
        return {
          color: "from-blue-500/20 to-indigo-500/20",
          icon: <Database className="h-5 w-5 text-blue-500" />,
          bgClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        };
      case 'DATABASE':
        return {
          color: "from-purple-500/20 to-pink-500/20",
          icon: <Database className="h-5 w-5 text-purple-500" />,
          bgClass: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        };
      case 'PROGRAMMING':
        return {
          color: "from-emerald-500/20 to-teal-500/20",
          icon: <Code className="h-5 w-5 text-emerald-500" />,
          bgClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        };
      case 'ALGORITHM':
        return {
          color: "from-amber-500/20 to-orange-500/20",
          icon: <BarChart3 className="h-5 w-5 text-amber-500" />,
          bgClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        };
      default:
        return {
          color: "from-gray-500/20 to-gray-500/20",
          icon: <FileText className="h-5 w-5 text-gray-500" />,
          bgClass: "bg-gray-50 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
        };
    }
  };

  // Filter exams based on search and filters
  const filteredExams = exams.filter(
    (exam) =>
      (activeTab === "all" ||
       (activeTab === "draft" && exam.status === 'DRAFT') ||
       (activeTab === "published" && exam.status === 'PUBLISHED') ||
       (activeTab === "expired" && new Date(exam.endDate) < new Date())) &&
      (searchQuery === "" || exam.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedSubjects.length === 0 || selectedSubjects.includes(exam.subject))
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Chargement des examens...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-background/80 backdrop-blur-xl sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-primary">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">Utilisateurs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Gestion des Sujets d'Examens
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 ml-4 pl-6">
                Créez, modifiez et gérez vos sujets d'examens avec facilité
              </p>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30 rounded-xl"
                    onClick={handleCreateExam}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un nouveau sujet
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ajouter un nouveau sujet d'examen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sujets Brouillon</p>
                    <h3 className="text-2xl font-bold mt-1">{exams.filter(exam => exam.status === 'DRAFT').length}</h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Pourcentage</span>
                    <span>
                      {exams.length > 0 
                        ? Math.round((exams.filter(exam => exam.status === 'DRAFT').length / exams.length) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={exams.length > 0 
                      ? (exams.filter(exam => exam.status === 'DRAFT').length / exams.length) * 100
                      : 0} 
                    className="h-1.5" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sujets Publiés</p>
                    <h3 className="text-2xl font-bold mt-1">{exams.filter(exam => exam.status === 'PUBLISHED').length}</h3>
                  </div>
                  <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Taux de complétion</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sujets Expirés</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {exams.filter(exam => new Date(exam.endDate) < new Date()).length}
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Pourcentage</span>
                    <span>
                      {Math.round((exams.filter(exam => new Date(exam.endDate) < new Date()).length / exams.length) * 100) || 0}%
                    </span>
                  </div>
                  <Progress 
                    value={(exams.filter(exam => new Date(exam.endDate) < new Date()).length / exams.length) * 100 || 0} 
                    className="h-1.5" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="relative z-20">
          <Card className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div
                  className={`relative flex-1 transition-all duration-300 ${isSearchFocused ? "ring-2 ring-blue-500/20 rounded-lg" : ""}`}
                >
                  <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${isSearchFocused ? "text-blue-500" : "text-slate-400"}`}
                  />
                  <Input
                    placeholder="Rechercher un examen..."
                    className="pl-10 bg-transparent border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500/30 h-11 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-full"
                      onClick={() => setSearchQuery("")}
                    >
                      <span className="sr-only">Clear</span>
                      <span className="text-slate-400">×</span>
                    </Button>
                  )}
                </div>

                <div className="relative">
                  <Button
                    variant="outline"
                    className={`w-full md:w-auto border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 h-11 ${filterOpen ? "ring-2 ring-blue-500/20" : ""}`}
                    onClick={() => setFilterOpen(!filterOpen)}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
                  </Button>

                  {filterOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-3 z-50"
                    >
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Type de sujet</p>
                        <div className="grid grid-cols-2 gap-2">
                          {["SQL", "DATABASE", "PROGRAMMING", "ALGORITHM"].map((type) => (
                            <Button
                              key={type}
                              variant="outline"
                              size="sm"
                              className={`justify-start border-slate-200 dark:border-slate-700 ${
                                selectedSubjects.includes(type)
                                  ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                                  : "bg-transparent"
                              }`}
                              onClick={() => toggleSubjectFilter(type)}
                            >
                              {type}
                            </Button>
                          ))}
                        </div>

                        <div className="pt-2 flex justify-between">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedSubjects([])}>
                            Réinitialiser
                          </Button>
                          <Button size="sm" onClick={() => setFilterOpen(false)}>
                            Appliquer
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-1 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm relative z-10">
          {[
            { id: "all", label: "Tous les sujets", count: exams.length },
            { id: "draft", label: "Brouillons", count: exams.filter(exam => exam.status === 'DRAFT').length },
            { id: "published", label: "Publiés", count: exams.filter(exam => exam.status === 'PUBLISHED' && new Date(exam.endDate) >= new Date()).length },
            { id: "expired", label: "Expirés", count: exams.filter(exam => new Date(exam.endDate) < new Date()).length },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm" />
              )}
              <span className="relative z-0 flex items-center">
                {tab.label}
                <span className="ml-2 rounded-full bg-slate-100 dark:bg-slate-600 px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              </span>
            </Button>
          ))}
        </div>

        {/* Exam Cards Grid */}
        <div className="pt-4">
          {filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map((exam) => {
                const isExpired = new Date(exam.endDate) < new Date();
                const typeStyle = getExamTypeStyle(exam.subject);
                
                return (
                  <div
                    key={exam.id}
                    onMouseEnter={() => setHoveredCard(exam.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Card
                      className={`overflow-hidden p-0 transition-all duration-300 border-slate-200/50 dark:border-slate-700/50 ${
                        hoveredCard === exam.id
                          ? "shadow-xl scale-[1.02] bg-white dark:bg-slate-800"
                          : "shadow-md bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm"
                      }`}
                    >
                      <div className={`h-2 bg-gradient-to-r ${typeStyle.color}`} />
                      <CardHeader className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                          <Badge
                            variant="outline"
                            className={`px-3 py-1 rounded-full font-medium border-0 ${typeStyle.bgClass}`}
                          >
                            <div className="flex items-center">
                              {typeStyle.icon}
                              <span className="ml-1.5">{exam.subject}</span>
                            </div>
                          </Badge>

                          <Badge
                            variant={isExpired ? "outline" : "default"}
                            className={`font-normal ${
                              isExpired
                                ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-0"
                                : exam.status === 'PUBLISHED'
                                  ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {isExpired ? "Expiré" : exam.status === 'PUBLISHED' ? "Publié" : "Brouillon"}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-bold mt-3 text-slate-900 dark:text-white">{exam.title}</h3>
                      </CardHeader>

                      <CardContent className="p-5 pt-0 pb-3">
                        <div className="space-y-4 text-sm">
                          <div className="flex items-center text-slate-500 dark:text-slate-400 gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className={isExpired ? "text-red-500 dark:text-red-400" : ""}>
                              Date limite: {formatDate(exam.endDate)}
                            </span>
                          </div>

                          <div className="flex items-center text-slate-500 dark:text-slate-400 gap-2">
                            <Award className="h-4 w-4" />
                            <span>Points: {exam.totalPoints}</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-0">
                        <div className="grid grid-cols-3 w-full divide-x divide-slate-200 dark:divide-slate-700 border-t border-slate-200 dark:border-slate-700">
                          <Button
                            variant="ghost"
                            className="rounded-none py-3 h-auto text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            onClick={() => handleViewExam(exam.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            <span>Voir</span>
                          </Button>

                          <Button
                            variant="ghost"
                            className="rounded-none py-3 h-auto text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            onClick={() => handleEditExam(exam.id)}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            <span>Modifier</span>
                          </Button>

                          <Button
                            variant="ghost"
                            className="rounded-none py-3 h-auto text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            onClick={() => setExamToDelete({ id: exam.id, title: exam.title })}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span>Supprimer</span>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-slate-900 dark:text-white">Aucun résultat trouvé</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                Aucun sujet ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou créez un
                nouveau sujet.
              </p>
              <Button 
                className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleCreateExam}
              >
                <Plus className="mr-2 h-4 w-4" />
                Créer un nouveau sujet
              </Button>
            </div>
          )}
        </div>
      </div>

      <DeleteExamDialog
        open={!!examToDelete}
        onOpenChange={(open) => !open && setExamToDelete(null)}
        onConfirm={() => examToDelete && handleDeleteExam(examToDelete.id)}
        examTitle={examToDelete?.title || ''}
      />
    </div>
    </>
  );
}