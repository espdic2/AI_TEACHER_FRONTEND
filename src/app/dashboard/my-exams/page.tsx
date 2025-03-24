"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { examService } from "@/services/examService";
import { StudentExam, StudentExamStatus } from "@/types/studentExams";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  FileCheck,
  Upload,
  Calendar,
  Clock,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  ArrowUpRight,
  FileText
} from "lucide-react";

export default function MyExamsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [exams, setExams] = useState<StudentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await examService.getStudentExams();
        setExams(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des examens");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'STUDENT') {
      fetchExams();
    }
  }, [user?.role]);

  const handleViewExam = (examId: string, status: StudentExamStatus) => {
    if (status === StudentExamStatus.IN_PROGRESS) {
      router.push(`/dashboard/my-exams/${examId}/submit`);
    } else {
      router.push(`/dashboard/my-exams/${examId}`);
    }
  };

  // Filtrer les examens en fonction de la recherche
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exam.exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === "all" || exam.exam.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  // Obtenir la liste unique des matières pour le filtre
  const subjects = [...new Set(exams.map(exam => exam.exam.subject))];

  // Calculer les statistiques
  const totalExams = exams.length;
  const completedExams = exams.filter(exam => 
    exam.status === StudentExamStatus.COMPLETED || 
    exam.status === StudentExamStatus.GRADED
  ).length;
  const inProgressExams = exams.filter(exam => 
    exam.status === StudentExamStatus.IN_PROGRESS
  ).length;
  const gradedExams = exams.filter(exam => 
    exam.status === StudentExamStatus.GRADED
  ).length;
  
  // Calculer la moyenne des examens notés
  const calculateAverageScore = () => {
    const gradedExams = exams.filter(exam => exam.score !== null);
    if (gradedExams.length === 0) return null;
    
    const sum = gradedExams.reduce((acc, exam) => acc + (exam.score || 0), 0);
    return (sum / gradedExams.length).toFixed(2);
  };
  
  const averageScore = calculateAverageScore();

  // Fonction pour obtenir la classe CSS du badge de statut
  const getStatusBadgeClass = (status: StudentExamStatus) => {
    switch (status) {
      case StudentExamStatus.GRADED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case StudentExamStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case StudentExamStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Fonction pour obtenir le texte du statut
  const getStatusText = (status: StudentExamStatus) => {
    switch (status) {
      case StudentExamStatus.GRADED:
        return 'Noté';
      case StudentExamStatus.COMPLETED:
        return 'Terminé';
      case StudentExamStatus.IN_PROGRESS:
        return 'En cours';
      default:
        return status;
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status: StudentExamStatus) => {
    switch (status) {
      case StudentExamStatus.GRADED:
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case StudentExamStatus.COMPLETED:
        return <FileCheck className="h-4 w-4 mr-1" />;
      case StudentExamStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Vérifier si un examen est proche de la date limite
  const isNearDeadline = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <span className="text-red-500">Expiré</span>;
    } else if (diffDays === 0) {
      return <span className="text-orange-500">Aujourd'hui</span>;
    } else if (diffDays === 1) {
      return <span className="text-orange-500">Demain</span>;
    } else if (diffDays <= 3) {
      return <span className="text-orange-500">Dans {diffDays} jours</span>;
    } else {
      return <span>{date.toLocaleDateString()}</span>;
    }
  };

  if (user?.role !== 'STUDENT') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Accès non autorisé</h2>
            <p className="text-muted-foreground">
              Cette page est réservée aux étudiants.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    <div className="flex flex-col min-h-screen">
      <header className="bg-background sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b p-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Mes Examens</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mes Examens</h1>
            <p className="text-muted-foreground mt-1">Gérez et suivez vos examens en cours et passés</p>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des examens</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExams}</div>
              <p className="text-xs text-muted-foreground">
                Examens assignés
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressExams}</div>
              <p className="text-xs text-muted-foreground">
                À compléter
              </p>
              {inProgressExams > 0 && (
                <Progress value={(completedExams / totalExams) * 100} className="h-1 mt-2" />
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complétés</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedExams}</div>
              <p className="text-xs text-muted-foreground">
                {gradedExams} notés sur {completedExams}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moyenne</CardTitle>
              <FileCheck className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore ? `${averageScore}/20` : 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                Basé sur {gradedExams} examens notés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un examen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
              <div className="w-full md:w-64 flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select 
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">Toutes les matières</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets pour les différents statuts */}
        <Tabs defaultValue="all" className="flex-1">
          <TabsList className="mb-4 bg-white dark:bg-gray-800 p-1 shadow-sm">
            <TabsTrigger value="all" className="flex-1">Tous ({exams.length})</TabsTrigger>
            <TabsTrigger value="in_progress" className="flex-1">
              En cours ({exams.filter(exam => exam.status === StudentExamStatus.IN_PROGRESS).length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Terminés ({exams.filter(exam => exam.status === StudentExamStatus.COMPLETED).length})
            </TabsTrigger>
            <TabsTrigger value="graded" className="flex-1">
              Notés ({exams.filter(exam => exam.status === StudentExamStatus.GRADED).length})
            </TabsTrigger>
          </TabsList>

          {/* Contenu de l'onglet "Tous" */}
          <TabsContent value="all" className="space-y-4">
            {filteredExams.length === 0 ? (
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun examen trouvé</h3>
                  <p className="text-muted-foreground text-center">
                    {searchTerm || subjectFilter !== "all" 
                      ? "Aucun examen ne correspond à vos critères de recherche." 
                      : "Vous n'avez pas encore d'examens assignés."}
                  </p>
                  {(searchTerm || subjectFilter !== "all") && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSearchTerm("");
                        setSubjectFilter("all");
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredExams.map((studentExam) => (
                  <Card 
                    key={studentExam.id} 
                    className={`overflow-hidden border-l-4 hover:shadow-md transition-shadow ${
                      studentExam.status === StudentExamStatus.IN_PROGRESS && isNearDeadline(studentExam.exam.endDate)
                        ? 'border-l-red-500'
                        : studentExam.status === StudentExamStatus.IN_PROGRESS
                        ? 'border-l-amber-500'
                        : studentExam.status === StudentExamStatus.COMPLETED
                        ? 'border-l-blue-500'
                        : 'border-l-green-500'
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{studentExam.exam.title}</h3>
                            <Badge className={`${getStatusBadgeClass(studentExam.status)} flex items-center`}>
                              {getStatusIcon(studentExam.status)}
                              {getStatusText(studentExam.status)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>{studentExam.exam.subject}</span>
                            </div>
                            {studentExam.status === StudentExamStatus.IN_PROGRESS && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Date limite: </span>
                                <span className={isNearDeadline(studentExam.exam.endDate) ? "text-red-500 font-medium" : ""}>
                                  {formatDate(studentExam.exam.endDate)}
                                </span>
                              </div>
                            )}
                            {studentExam.endedAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Soumis le: {new Date(studentExam.endedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                            {studentExam.score !== null && (
                              <div className="flex items-center gap-1 font-medium">
                                <span>Note: </span>
                                <span className={
                                  studentExam.score >= 14 ? "text-green-600" : 
                                  studentExam.score >= 10 ? "text-blue-600" : "text-red-600"
                                }>
                                  {studentExam.score}/20
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          {studentExam.status === StudentExamStatus.IN_PROGRESS ? (
                            <Button
                              className="w-full md:w-auto"
                              onClick={() => handleViewExam(studentExam.exam.id, studentExam.status)}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Rendre l'examen
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full md:w-auto"
                              onClick={() => handleViewExam(studentExam.exam.id, studentExam.status)}
                            >
                              <FileCheck className="h-4 w-4 mr-2" />
                              Voir ma réponse
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Contenu des autres onglets */}
          {['in_progress', 'completed', 'graded'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filteredExams
                .filter((exam) => exam.status.toLowerCase() === status)
                .length === 0 ? (
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center">
                    {status === 'in_progress' ? (
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    ) : status === 'completed' ? (
                      <FileCheck className="h-12 w-12 text-blue-500 mb-4" />
                    ) : (
                      <FileCheck className="h-12 w-12 text-green-500 mb-4" />
                    )}
                    <h3 className="text-lg font-medium mb-2">
                      {status === 'in_progress' 
                        ? "Aucun examen en cours" 
                        : status === 'completed' 
                        ? "Aucun examen en attente de notation" 
                        : "Aucun examen noté"}
                    </h3>
                    <p className="text-muted-foreground text-center">
                      {searchTerm || subjectFilter !== "all" 
                        ? "Aucun examen ne correspond à vos critères de recherche." 
                        : status === 'in_progress' 
                        ? "Vous êtes à jour avec tous vos examens!" 
                        : status === 'completed' 
                        ? "Vous n'avez pas encore d'examens en attente de notation." 
                        : "Vous n'avez pas encore d'examens notés."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredExams
                    .filter((exam) => exam.status.toLowerCase() === status)
                    .map((studentExam) => (
                      <Card 
                        key={studentExam.id} 
                        className={`overflow-hidden border-l-4 hover:shadow-md transition-shadow ${
                          studentExam.status === StudentExamStatus.IN_PROGRESS && isNearDeadline(studentExam.exam.endDate)
                            ? 'border-l-red-500'
                            : studentExam.status === StudentExamStatus.IN_PROGRESS
                            ? 'border-l-amber-500'
                            : studentExam.status === StudentExamStatus.COMPLETED
                            ? 'border-l-blue-500'
                            : 'border-l-green-500'
                        }`}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                            <div className="mb-4 md:mb-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold">{studentExam.exam.title}</h3>
                                <Badge className={`${getStatusBadgeClass(studentExam.status)} flex items-center`}>
                                  {getStatusIcon(studentExam.status)}
                                  {getStatusText(studentExam.status)}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-3.5 w-3.5" />
                                  <span>{studentExam.exam.subject}</span>
                                </div>
                                {studentExam.status === StudentExamStatus.IN_PROGRESS && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>Date limite: </span>
                                    <span className={isNearDeadline(studentExam.exam.endDate) ? "text-red-500 font-medium" : ""}>
                                      {formatDate(studentExam.exam.endDate)}
                                    </span>
                                  </div>
                                )}
                                {studentExam.endedAt && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>Soumis le: {new Date(studentExam.endedAt).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {studentExam.score !== null && (
                                  <div className="flex items-center gap-1 font-medium">
                                    <span>Note: </span>
                                    <span className={
                                      studentExam.score >= 14 ? "text-green-600" : 
                                      studentExam.score >= 10 ? "text-blue-600" : "text-red-600"
                                    }>
                                      {studentExam.score}/20
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              {studentExam.status === StudentExamStatus.IN_PROGRESS ? (
                                <Button
                                  className="w-full md:w-auto"
                                  onClick={() => handleViewExam(studentExam.exam.id, studentExam.status)}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Rendre l'examen
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  className="w-full md:w-auto"
                                  onClick={() => handleViewExam(studentExam.exam.id, studentExam.status)}
                                >
                                  <FileCheck className="h-4 w-4 mr-2" />
                                  Voir ma réponse
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}