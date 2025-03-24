"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExamViewer } from "@/components/ui/exam-viewer";
import {
  FileCheck,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  Download,
  FileText,
  Award,
  MessageCircle
} from "lucide-react";

export default function ExamDetailPage() {
  const { user } = useAppSelector((state) => state.auth);
  const params = useParams();
  const examId = params.examId as string;
  const router = useRouter();
  const [studentExam, setStudentExam] = useState<StudentExam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const data = await examService.getStudentExamById(examId);
        setStudentExam(data);
      } catch (error) {
        toast.error("Erreur lors du chargement de l'examen");
      } finally {
        setLoading(false);
      }
    };

    if (examId && user?.role === 'STUDENT') {
      fetchExam();
    }
  }, [examId, user?.role]);

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

  if (user?.role !== 'STUDENT') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 flex flex-col items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FileText className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Accès non autorisé</h2>
              <p className="text-muted-foreground mb-6">
                Cette page est réservée aux étudiants.
              </p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retourner au tableau de bord
            </Button>
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
          <h2 className="text-xl font-semibold">Chargement de l'examen</h2>
          <p className="text-muted-foreground max-w-md">
            Nous récupérons les informations de votre examen, veuillez patienter un instant...
          </p>
        </div>
      </div>
    );
  }

  if (!studentExam) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 flex flex-col items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FileText className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Examen non trouvé</h2>
              <p className="text-muted-foreground mb-6">
                L'examen n'existe pas ou vous n'y avez pas accès.
              </p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/my-exams')}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retourner à mes examens
            </Button>
          </CardContent>
        </Card>
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
              <BreadcrumbLink href="/dashboard/my-exams">Mes Examens</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{studentExam.exam.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">{studentExam.exam.title}</h1>
              <Badge className={`${getStatusBadgeClass(studentExam.status)} flex items-center`}>
                {getStatusIcon(studentExam.status)}
                {getStatusText(studentExam.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {studentExam.exam.subject} • {studentExam.status === StudentExamStatus.IN_PROGRESS ? 
                `À rendre avant le ${new Date(studentExam.exam.endDate).toLocaleDateString()}` : 
                studentExam.endedAt ? `Soumis le ${new Date(studentExam.endedAt).toLocaleDateString()}` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            {studentExam.status === StudentExamStatus.IN_PROGRESS ? (
              <Button 
                onClick={() => router.push(`/dashboard/my-exams/${examId}/submit`)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all hover:shadow-lg"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Rendre l'examen
              </Button>
            ) : (
              <Button variant="outline" onClick={() => router.push('/dashboard/my-exams')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux examens
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-none shadow-md lg:col-span-1 hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Détails de l'examen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm text-muted-foreground">Matière:</span>
                  <span className="font-medium">{studentExam.exam.subject}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm text-muted-foreground">Date limite:</span>
                  <span className="font-medium">
                    {new Date(studentExam.exam.endDate).toLocaleDateString()}
                  </span>
                </div>
                
                {studentExam.endedAt && (
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm text-muted-foreground">Soumis le:</span>
                    <span className="font-medium">
                      {new Date(studentExam.endedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {studentExam.score !== null && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm text-muted-foreground">Note:</span>
                    <span className={`font-bold text-lg ${
                      studentExam.score >= 14 ? "text-green-600" : 
                      studentExam.score >= 10 ? "text-blue-600" : "text-red-600"
                    }`}>
                      {studentExam.score}/20
                    </span>
                  </div>
                )}
              </div>

              {studentExam.fileUrl && studentExam.status !== StudentExamStatus.IN_PROGRESS && (
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors" 
                    onClick={() => window.open(studentExam.fileUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger ma réponse
                  </Button>
                </div>
              )}
            </CardContent>
            {studentExam.status === StudentExamStatus.GRADED && (
          <Card className="transition-all border-t-4 border-t-purple-500 mx-4 mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
                Commentaires du professeur
              </CardTitle>
              <CardDescription>
                Retours et évaluation de votre travail
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 py-4">
              {studentExam.feedback ? (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-100 dark:border-purple-800">
                  <p className="italic text-gray-700 dark:text-gray-300">{studentExam.feedback}</p>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-muted-foreground">Aucun commentaire n'a été laissé par le professeur.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
          </Card>

          <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-all border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Sujet de l'examen
              </CardTitle>
              <CardDescription>
                Consultez le sujet de l'examen ci-dessous
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 h-[600px] overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800/50">
              <ExamViewer fileUrl={studentExam.exam.fileUrl || ''} format={studentExam.exam.format}/>
            </CardContent>
          </Card>
        </div>

        {studentExam.status !== StudentExamStatus.IN_PROGRESS && (
          <Card className="shadow-md hover:shadow-lg transition-all border-t-4 border-t-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-green-600" />
                Ma réponse
              </CardTitle>
              <CardDescription>
                Voici la réponse que vous avez soumise pour cet examen
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 h-[600px] overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800/50">
              <ExamViewer fileUrl={studentExam.fileUrl || ''} format={studentExam.exam.format} />
            </CardContent>
          </Card>
        )}
        {/*studentExam.status === StudentExamStatus.GRADED && (
          <Card className="shadow-md hover:shadow-lg transition-all border-t-4 border-t-purple-500 mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
                Commentaires du professeur
              </CardTitle>
              <CardDescription>
                Retours et évaluation de votre travail
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 py-4">
              {studentExam.feedback ? (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-100 dark:border-purple-800">
                  <p className="italic text-gray-700 dark:text-gray-300">{studentExam.feedback}</p>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-muted-foreground">Aucun commentaire n'a été laissé par le professeur.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )*/}
      </div>
    </div>
  );
} 