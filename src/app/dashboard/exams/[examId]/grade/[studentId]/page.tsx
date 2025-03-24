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
import { Button } from "@/components/ui/button";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Award,
  Brain,
  UserCircle,
  Calendar,
  FileCheck,
  MessageCircle,
  Save,
  Download,
  BookOpen,
} from "lucide-react";
import { ExamViewer } from "@/components/ui/exam-viewer";

export default function GradeStudentExamPage() {
  const { user } = useAppSelector((state) => state.auth);
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const studentId = params.studentId as string;
  
  const [studentExam, setStudentExam] = useState<StudentExam | null>(null);
  const [score, setScore] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("student-answer");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const data = await examService.getStudentAnswerById(examId, studentId);
        setStudentExam(data);
        setScore(data.score?.toString() || "");
        setFeedback(data.feedback || "");
      } catch (error) {
        toast.error("Erreur lors du chargement de l'examen");
      } finally {
        setLoading(false);
      }
    };

    if (examId && studentId && (user?.role === 'PROFESSOR' || user?.role === 'ADMIN')) {
      fetchExam();
    }
  }, [examId, studentId, user?.role]);

  const handleSubmitGrade = async () => {
    try {
      setSaving(true);
      const numericScore = parseFloat(score);
      if (isNaN(numericScore) || numericScore < 0 || numericScore > 20) {
        toast.error("La note doit être comprise entre 0 et 20");
        setSaving(false);
        return;
      }

      await examService.gradeExam(examId, studentId, numericScore, feedback);
      toast.success("Note et commentaires enregistrés avec succès");
      router.push(`/dashboard/exams/${examId}/grade`);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de la note");
      setSaving(false);
    }
  };

  const handleAutoCorrect = async () => {
    try {
      setSaving(true);
      const result = await examService.autoCorrectExam(examId, studentId);
      setScore(result.result.toString());
      setFeedback(result.result.feedback || feedback);
      toast.success("Correction automatique effectuée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la correction automatique");
    } finally {
      setSaving(false);
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
              Cette page est réservée aux professeurs et administrateurs.
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
          <h2 className="text-xl font-semibold">Chargement de l'examen</h2>
          <p className="text-muted-foreground max-w-md">
            Nous récupérons les informations de l'examen et de la soumission, veuillez patienter un instant...
          </p>
        </div>
      </div>
    );
  }

  if (!studentExam) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Examen non trouvé</h2>
            <p className="text-muted-foreground">
              L'examen n'existe pas ou vous n'y avez pas accès.
            </p>
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
              <BreadcrumbLink href="/dashboard/exams">Examens</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/exams/${examId}`}>{studentExam.exam.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/exams/${examId}/grade`}>Correction</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{studentExam.student.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 p-6 container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{studentExam.exam.title}</h1>
            <p className="text-muted-foreground mt-1">
              Correction de la copie de <span className="font-medium">{studentExam.student.name}</span> • 
              {studentExam.endedAt ? ` Soumis le ${new Date(studentExam.endedAt).toLocaleDateString()}` : ' Non soumis'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/exams/${examId}/grade`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
            <Button 
              onClick={handleAutoCorrect}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Correction automatique
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-none shadow-md lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <UserCircle className="h-5 w-5 mr-2 text-blue-600" />
                Informations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm text-muted-foreground">Étudiant:</span>
                  <span className="font-medium">{studentExam.student.name}</span>
                </div>
                
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
                
                <div className="flex items-center gap-2">
                  <Badge className={`flex items-center w-fit ${
                    studentExam.status === StudentExamStatus.GRADED 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : studentExam.status === StudentExamStatus.COMPLETED 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {studentExam.status === StudentExamStatus.GRADED 
                      ? <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      : studentExam.status === StudentExamStatus.COMPLETED
                      ? <FileCheck className="h-3.5 w-3.5 mr-1" />
                      : <Clock className="h-3.5 w-3.5 mr-1" />
                    }
                    {studentExam.status === StudentExamStatus.GRADED 
                      ? 'Noté' 
                      : studentExam.status === StudentExamStatus.COMPLETED
                      ? 'Terminé'
                      : 'En cours'
                    }
                  </Badge>
                </div>
              </div>

              {studentExam.fileUrl && (
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors" 
                    onClick={() => window.open(studentExam.fileUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger la réponse
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-md">
            <CardHeader className="pb-0">
              <CardTitle>Noter l'examen</CardTitle>
              <CardDescription>
                Attribuez une note et des commentaires à cet examen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="score" className="text-base font-medium mb-2 block">
                    Note sur 20
                  </Label>
                  <div className="relative">
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="Entrez une note entre 0 et 20"
                      className="text-lg font-bold pl-4 h-12"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg font-bold text-muted-foreground">
                      /20
                    </div>
                  </div>
                  {score && !isNaN(parseFloat(score)) && (
                    <div className={`mt-2 font-bold text-right ${getScoreClass(parseFloat(score))}`}>
                      {parseFloat(score) >= 10 ? "Réussite" : "Échec"}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium">Barème indicatif</span>
                    </div>
                    <Badge variant="outline" className="font-normal">
                      Sur 20 points
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span>Excellent</span>
                      <span className="font-bold text-green-600 dark:text-green-400">16-20</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <span>Bien</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">14-16</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                      <span>Satisfaisant</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">10-14</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <span>Insuffisant</span>
                      <span className="font-bold text-red-600 dark:text-red-400">0-10</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="feedback" className="text-base font-medium mb-2 block">
                  Commentaires
                </Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Ajoutez vos commentaires et retours sur cet examen..."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => router.push(`/dashboard/exams/${examId}/grade`)}>
                Annuler
              </Button>
              <Button 
                onClick={handleSubmitGrade}
                disabled={saving}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer la note
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white dark:bg-gray-800 p-1 shadow-sm">
            <TabsTrigger value="student-answer" className="flex-1">
              <FileCheck className="h-4 w-4 mr-2" />
              Réponse de l'étudiant
            </TabsTrigger>
            <TabsTrigger value="exam-subject" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Sujet de l'examen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student-answer" className="mt-0">
            <Card className="shadow-md hover:shadow-lg transition-all border-t-4 border-t-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-green-600" />
                  Réponse de {studentExam.student.name}
                </CardTitle>
                <CardDescription>
                  {studentExam.endedAt 
                    ? `Soumis le ${new Date(studentExam.endedAt).toLocaleDateString()}` 
                    : 'Non soumis'}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 h-[600px] overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800/50">
                {studentExam.fileUrl ? (
                  <PDFViewer fileUrl={studentExam.fileUrl} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">Aucune réponse soumise</p>
                    <p>L'étudiant n'a pas encore soumis sa réponse pour cet examen.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exam-subject" className="mt-0">
            <Card className="shadow-md hover:shadow-lg transition-all border-t-4 border-t-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Sujet de l'examen
                </CardTitle>
                <CardDescription>
                  Document d'examen original
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 h-[600px] overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800/50">
                <ExamViewer fileUrl={studentExam.exam.fileUrl || ''} format={studentExam.exam.format} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}