"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { examService } from "@/services/examService";
import { StudentExam } from "@/types/studentExams";
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
import { FileUp, Calendar, BookOpen, Clock, CheckCircle, AlertCircle, Upload, Database, Code, BarChart3, FileText, Brain } from "lucide-react";
import { ExamViewer } from "@/components/ui/exam-viewer";
import { StudentExamStatus } from "@/types/studentExams";
import { Progress } from "@/components/ui/progress";

export default function SubmitExamPage() {
  const { user } = useAppSelector((state) => state.auth);
  const params = useParams();
  const examId = params.examId as string;
  const router = useRouter();
  const [studentExam, setStudentExam] = useState<StudentExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<'uploading' | 'processing' | 'completed'>('uploading');

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const data = await examService.getStudentExamById(examId);
        setStudentExam(data);
        
        // Vérifier le statut de l'examen dès le chargement
        if (data && (data.status === StudentExamStatus.COMPLETED || data.status === StudentExamStatus.GRADED)) {
          toast.error("Vous avez déjà soumis cet examen. Redirection vers la liste des examens...", {
            duration: 4000,
          });
          // Redirection après 4 secondes
          setTimeout(() => {
            router.push('/dashboard/my-exams');
          }, 4000);
        }
      } catch (error) {
        toast.error("Erreur lors du chargement de l'examen");
      } finally {
        setLoading(false);
      }
    };

    if (examId && user?.role === 'STUDENT') {
      fetchExam();
    }
  }, [examId, user?.role, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check file type
    if (file.type !== 'application/pdf') {
      toast.error("Seuls les fichiers PDF sont acceptés");
      return;
    }
    
    // Check file size (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("La taille du fichier ne doit pas dépasser 5MB");
      return;
    }

    setAnswerFile(file);
    toast.success("Fichier ajouté avec succès");
  };

  const handleSubmit = async () => {
    if (!answerFile) {
      toast.error("Veuillez sélectionner un fichier PDF");
      return;
    }

    try {
      setSubmitting(true);
      
      // Première étape : upload du fichier
      let fileUrl;
      try {
        fileUrl = await examService.uploadFile(answerFile);
      } catch (error) {
        toast.error("Erreur lors de l'upload du fichier");
        setSubmitting(false);
        return;
      }
      
      // Deuxième étape : soumettre la réponse
      try {
        await examService.submitExamAnswer(examId, { fileUrl });
        
        // Afficher un message de succès
        toast.success("Votre examen a été soumis avec succès!");
        
        // Attendre 5 secondes avant de rediriger
        setTimeout(() => {
          router.push('/dashboard/my-exams');
        }, 5000);
        
      } catch (error) {
        toast.error("Erreur lors de la soumission de l'examen");
        setSubmitting(false);
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      setSubmitting(false);
    }
  };

  const calculateTotalPoints = () => {
    return studentExam?.exam.questions.reduce((total, q) => total + (q.points || 0), 0) || 0;
  };

  const isExamExpired = () => {
    if (!studentExam?.exam.endDate) return false;
    return new Date(studentExam.exam.endDate) < new Date();
  };

  const formatTimeRemaining = () => {
    if (!studentExam?.exam.endDate) return "Pas de date limite";
    
    const endDate = new Date(studentExam.exam.endDate);
    const now = new Date();
    
    if (endDate < now) return "Expiré";
    
    const diffMs = endDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}j ${diffHrs}h restants`;
    } else if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m restants`;
    } else {
      return `${diffMins} minutes restantes`;
    }
  };

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

  if (user?.role !== 'STUDENT') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Accès non autorisé
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">
              Cette page est réservée aux étudiants.
            </p>
            <Button 
              className="w-full" 
              onClick={() => router.push('/dashboard')}
            >
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Chargement de l'examen</h2>
        <p className="text-muted-foreground">Veuillez patienter un instant...</p>
      </div>
    );
  }

  if (!studentExam) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Examen non trouvé
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">
              L'examen n'existe pas ou vous n'y avez pas accès.
            </p>
            <Button 
              className="w-full" 
              onClick={() => router.push('/dashboard/my-exams')}
            >
              Retour à mes examens
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vérification si l'examen a déjà été soumis
  if (studentExam && (studentExam.status === StudentExamStatus.COMPLETED || studentExam.status === StudentExamStatus.GRADED)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Examen déjà soumis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-center">
              Vous avez déjà soumis votre réponse pour cet examen.
              {studentExam.status === StudentExamStatus.GRADED && " L'examen a déjà été noté."}
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md" 
              onClick={() => router.push('/dashboard/my-exams')}
            >
              Retourner à mes examens
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b p-4 shadow-sm">
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
              <BreadcrumbPage>Soumettre ma réponse</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  {studentExam.exam.title}
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 ml-4 pl-6 flex items-center gap-2">
                {getExamTypeStyle(studentExam.exam.subject).icon}
                {studentExam.exam.subject}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className={`px-3 py-1 rounded-full ${
                  isExamExpired() 
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatTimeRemaining()}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Points totaux : </span>
                <span className="font-semibold">{calculateTotalPoints()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="overflow-hidden border-none py-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader className="bg-gradient-to-r pt-4 from-blue-500/10 to-indigo-500/10 pb-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Soumettre ma réponse
                </CardTitle>
                <CardDescription>
                  Téléchargez votre fichier PDF pour soumettre votre réponse
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive 
                      ? "border-primary bg-primary/5" 
                      : answerFile 
                        ? "border-green-500 bg-green-50 dark:bg-green-900/10" 
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="answer-file"
                  />
                  <label htmlFor="answer-file" className="cursor-pointer block">
                    {answerFile ? (
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                    ) : (
                      <FileUp className="mx-auto h-12 w-12 text-blue-500/70 mb-3" />
                    )}
                    
                    {answerFile ? (
                      <div>
                        <p className="text-base font-medium mb-1">{answerFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(answerFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.preventDefault();
                            setAnswerFile(null);
                          }}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-base font-medium mb-1">
                          Glissez-déposez votre fichier ici ou cliquez pour parcourir
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Format accepté: PDF uniquement (max 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md h-12 text-base" 
                  onClick={handleSubmit}
                  disabled={!answerFile || submitting}
                >
                  {submitting ? "Soumission en cours..." : "Soumettre ma réponse"}
                </Button>
                
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  En soumettant votre réponse, vous confirmez que ce travail est le vôtre et qu'il respecte les règles de l'examen.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="overflow-hidden border-none py-0 shadow-lg h-full">
              <CardHeader className={`bg-gradient-to-r pt-4 ${getExamTypeStyle(studentExam.exam.subject).color} pb-2`}>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {getExamTypeStyle(studentExam.exam.subject).icon}
                  Sujet d'examen
                </CardTitle>
                <CardDescription>
                  Consultez le sujet d'examen ci-dessous
                </CardDescription>
              </CardHeader>
              <ExamViewer 
                fileUrl={studentExam.exam.fileUrl || ''} 
                format={studentExam.exam.format} 
                className="h-[calc(100vh-20rem)]"
              />
            </Card>
          </div>
        </div>
      </div>

      {submitting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 p-8 text-center max-w-md">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <h2 className="text-xl font-semibold">Traitement de votre copie</h2>
            <p className="text-muted-foreground">
              Votre copie est en cours de traitement. Vous serez redirigé vers vos examens dans quelques instants.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}