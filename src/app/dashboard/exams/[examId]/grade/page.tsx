"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { examService } from "@/services/examService";
import { StudentExam, StudentExamStatus } from "@/types/studentExams";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Eye,
  ArrowLeft,
  Award,
  Brain,
  UserCircle,
  Calendar,
  BarChart3,
  FileCheck,
} from "lucide-react";

export default function AutoGradeExamPage() {
  const { user } = useAppSelector((state) => state.auth);
  const params = useParams();
  const examId = params.examId as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<{[key: string]: boolean}>({});
  const [examData, setExamData] = useState<any>(null);
  const [studentExams, setStudentExams] = useState<StudentExam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        const examDetails = await examService.getExamWithSubmissions(examId);
        setExamData(examDetails);
        setStudentExams(examDetails.studentExams || []);
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    if (examId && (user?.role === 'PROFESSOR' || user?.role === 'ADMIN')) {
      fetchExamData();
    }
  }, [examId, user?.role]);

  const handleAutoCorrect = async (studentId: string) => {
    try {
      setProcessing(prev => ({ ...prev, [studentId]: true }));
      const result = await examService.autoCorrectExam(examId, studentId);
      
      // Mettre à jour les données locales avec le nouveau score
      setStudentExams(prevExams => 
        prevExams.map(exam => 
          exam.student.id === studentId 
            ? { ...exam, score: result.result, status: StudentExamStatus.GRADED }
            : exam
        )
      );

      toast.success("Correction automatique effectuée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la correction automatique");
    } finally {
      setProcessing(prev => ({ ...prev, [studentId]: false }));
    }
  };

  /*const handleBulkAutoCorrect = async () => {
    const ungraded = studentExams.filter(exam => 
      exam.status === StudentExamStatus.COMPLETED && exam.score === null
    );
    
    if (ungraded.length === 0) {
      toast.info("Aucun examen à corriger automatiquement");
      return;
    }

    try {
      toast.info(`Correction automatique de ${ungraded.length} examens en cours...`);
      
      for (const exam of ungraded) {
        setProcessing(prev => ({ ...prev, [exam.student.id]: true }));
        await handleAutoCorrect(exam.student.id);
      }
      
      toast.success(`${ungraded.length} examens corrigés avec succès`);
    } catch (error) {
      toast.error("Erreur lors de la correction automatique en masse");
    }
  };*/

  // Filtrer les examens en fonction de la recherche et de l'onglet actif
  const filteredExams = studentExams.filter(exam => {
    const matchesSearch = 
      exam.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.score !== null && exam.score.toString().includes(searchTerm));
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "completed") return exam.status === StudentExamStatus.COMPLETED && matchesSearch;
    if (activeTab === "graded") return exam.status === StudentExamStatus.GRADED && matchesSearch;
    if (activeTab === "in_progress") return exam.status === StudentExamStatus.IN_PROGRESS && matchesSearch;
    
    return matchesSearch;
  });

  // Calculer les statistiques
  const totalSubmissions = studentExams.length;
  const completedCount = studentExams.filter(exam => 
    exam.status === StudentExamStatus.COMPLETED || exam.status === StudentExamStatus.GRADED
  ).length;
  const gradedCount = studentExams.filter(exam => 
    exam.status === StudentExamStatus.GRADED && exam.score !== null
  ).length;
  const inProgressCount = studentExams.filter(exam => 
    exam.status === StudentExamStatus.IN_PROGRESS
  ).length;
  
  // Calculer la moyenne des notes
  const averageScore = (() => {
    const gradedExams = studentExams.filter(exam => exam.score !== null);
    if (gradedExams.length === 0) return null;
    
    const sum = gradedExams.reduce((acc, exam) => acc + (exam.score || 0), 0);
    return (sum / gradedExams.length).toFixed(2);
  })();

  // Obtenir la classe CSS pour le badge de statut
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

  // Obtenir l'icône du statut
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

  // Obtenir le texte du statut
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

  // Obtenir la classe CSS pour la note
  const getScoreClass = (score: number | null) => {
    if (score === null) return '';
    if (score >= 16) return 'text-green-600 dark:text-green-400';
    if (score >= 14) return 'text-blue-600 dark:text-blue-400';
    if (score >= 10) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (user?.role !== 'PROFESSOR' && user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Accès non autorisé</h2>
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h2 className="text-xl font-semibold">Chargement des données</h2>
          <p className="text-muted-foreground max-w-md">
            Nous récupérons les informations de l'examen et des soumissions, veuillez patienter un instant...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
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
              <BreadcrumbLink href="/dashboard/exams">Examens</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/exams/${examId}`}>{examData?.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Correction</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 p-6 container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{examData?.title}</h1>
            <p className="text-muted-foreground mt-1">
              Correction des examens • {examData?.subject} • Date limite: {new Date(examData?.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/exams/${examId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'examen
            </Button>
            {/*<Button 
              onClick={handleBulkAutoCorrect}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              Correction automatique en masse
            </Button>*/}
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des étudiants</CardTitle>
              <UserCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                Étudiants assignés
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressCount}</div>
              <p className="text-xs text-muted-foreground">
                Examens non soumis
              </p>
              {totalSubmissions > 0 && (
                <Progress value={(completedCount / totalSubmissions) * 100} className="h-1 mt-2" />
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complétés</CardTitle>
              <FileCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground">
                {gradedCount} notés sur {completedCount}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moyenne</CardTitle>
              <Award className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore ? `${averageScore}/20` : 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                Basé sur {gradedCount} examens notés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un étudiant ou une note..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Onglets pour les différents statuts */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white dark:bg-gray-800 p-1 shadow-sm">
            <TabsTrigger value="all" className="flex-1">Tous ({studentExams.length})</TabsTrigger>
            <TabsTrigger value="in_progress" className="flex-1">
              En cours ({inProgressCount})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Terminés ({completedCount - gradedCount})
            </TabsTrigger>
            <TabsTrigger value="graded" className="flex-1">
              Notés ({gradedCount})
            </TabsTrigger>
          </TabsList>

          <Card className="shadow-md">
            <CardHeader className="pb-0">
              <CardTitle>Liste des étudiants</CardTitle>
              <CardDescription>
                {activeTab === "all" ? "Tous les étudiants" : 
                 activeTab === "in_progress" ? "Étudiants n'ayant pas encore soumis leur examen" :
                 activeTab === "completed" ? "Examens terminés en attente de notation" :
                 "Examens déjà notés"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <TableRow>
                      <TableHead className="w-[250px]">Étudiant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date de soumission</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <AlertCircle className="h-8 w-8 mb-2" />
                            <p>Aucun examen trouvé</p>
                            {searchTerm && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSearchTerm("")}
                                className="mt-2"
                              >
                                Effacer la recherche
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExams.map((submission) => (
                        <TableRow key={submission.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <UserCircle className="h-5 w-5 text-muted-foreground" />
                              {submission.student.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadgeClass(submission.status)} flex items-center w-fit`}>
                              {getStatusIcon(submission.status)}
                              {getStatusText(submission.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {submission.endedAt ? (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{new Date(submission.endedAt).toLocaleDateString()}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">Non soumis</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {submission.score !== null ? (
                              <div className={`font-bold ${getScoreClass(submission.score)}`}>
                                {submission.score}/20
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">Non noté</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {submission.status !== StudentExamStatus.IN_PROGRESS && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/dashboard/exams/${examId}/grade/${submission.student.id}`)}
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1" />
                                  Voir
                                </Button>
                              )}
                              {submission.status === StudentExamStatus.COMPLETED && (
                                <Button
                                  size="sm"
                                  onClick={() => handleAutoCorrect(submission.student.id)}
                                  disabled={processing[submission.student.id]}
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                  {processing[submission.student.id] ? (
                                    <>
                                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                      Correction...
                                    </>
                                  ) : (
                                    <>
                                      <Brain className="h-3.5 w-3.5 mr-1" />
                                      Auto-corriger
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Affichage de {filteredExams.length} sur {studentExams.length} étudiants
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/exams/${examId}`)}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Retour à l'examen
              </Button>
            </CardFooter>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}