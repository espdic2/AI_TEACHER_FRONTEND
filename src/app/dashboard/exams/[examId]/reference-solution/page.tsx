"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { examService } from "@/services/examService";
import { Exam } from "@/types/exam";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ExamViewer } from "@/components/ui/exam-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  FileText,
  ArrowLeft,
  Brain,
  Save,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function ReferenceSolutionPage() {
  const { user } = useAppSelector((state) => state.auth);
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exam, setExam] = useState<Exam | null>(null);
  const [referencedSolution, setReferencedSolution] = useState("");
  const [activeTab, setActiveTab] = useState("solution");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const examData = await examService.getExamById(examId);
        setExam(examData);
        setReferencedSolution(examData.referencedSolution || "");
        
        if (!examData.referencedSolution) {
          setAutoGenerating(true);
          generateSolutionAutomatically();
        }
      } catch (error) {
        toast.error("Erreur lors du chargement de l'examen");
      } finally {
        setLoading(false);
      }
    };

    if (examId) fetchExam();
  }, [examId]);

  const generateSolutionAutomatically = async () => {
    try {
      toast.info("Génération automatique de la solution de référence en cours...");
      const generatedSolution = await examService.generateReferenceSolution(examId);
      setReferencedSolution(generatedSolution);
      toast.success("Solution de référence générée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la génération automatique de la solution");
    } finally {
      setAutoGenerating(false);
    }
  };

  const handleGenerateSolution = async () => {
    try {
      setGenerating(true);
      toast.info("Génération de la solution de référence en cours...");
      const generatedSolution = await examService.generateReferenceSolution(examId);
      setReferencedSolution(generatedSolution);
      toast.success("Solution de référence générée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la génération de la solution");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveSolution = async () => {
    try {
      setSaving(true);
      await examService.updateReferenceSolution(examId, referencedSolution);
      toast.success("Solution de référence enregistrée avec succès");
      router.push(`/dashboard/exams/${examId}`);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de la solution");
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'PROFESSOR' && user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 flex flex-col items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Accès non autorisé</h2>
              <p className="text-muted-foreground mb-6">
                Cette page est réservée aux professeurs et administrateurs.
              </p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retourner au dashboard
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
            Nous récupérons les informations de l'examen, veuillez patienter un instant...
          </p>
        </div>
      </div>
    );
  }

  if (autoGenerating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h2 className="text-xl font-semibold">Génération automatique de la solution</h2>
          <p className="text-muted-foreground max-w-md">
            Nous générons une solution de référence pour cet examen, veuillez patienter un instant...
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
              <BreadcrumbLink href={`/dashboard/exams/${examId}`}>{exam?.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Solution de référence</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 p-6 container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{exam?.title}</h1>
            <p className="text-muted-foreground mt-1">
              Solution de référence • {exam?.subject} • Date limite: {new Date(exam?.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/exams/${examId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'examen
            </Button>
            <Button 
              onClick={handleSaveSolution}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer la solution
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Cartes d'information */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matière</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{exam?.subject}</div>
              <p className="text-xs text-muted-foreground">
                Examen {exam?.status === 'PUBLISHED' ? 'publié' : 'en brouillon'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Date limite</CardTitle>
              <Calendar className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{new Date(exam?.endDate).toLocaleDateString()}</div>
              <p className="text-xs text-muted-foreground">
                {new Date(exam?.endDate) > new Date() ? 'À venir' : 'Expiré'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solution</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{referencedSolution ? 'Disponible' : 'Non définie'}</div>
              <p className="text-xs text-muted-foreground">
                {referencedSolution ? 'Solution prête pour la correction automatique' : 'Veuillez définir une solution'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white dark:bg-gray-800 p-1 shadow-sm">
            <TabsTrigger value="solution" className="flex-1">
              <Brain className="h-4 w-4 mr-2" />
              Solution de référence
            </TabsTrigger>
            <TabsTrigger value="exam" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Sujet de l'examen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solution" className="mt-0">
            <Card className="shadow-md hover:shadow-lg transition-all border-t-4 border-t-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-600" />
                  Solution de référence
                </CardTitle>
                <CardDescription>
                  Cette solution sera utilisée comme référence pour la correction automatique
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 py-4">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    onClick={handleGenerateSolution}
                    disabled={generating}
                    className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Régénérer la solution avec IA
                      </>
                    )}
                  </Button>
                </div>
                
                <Textarea
                  value={referencedSolution}
                  onChange={(e) => setReferencedSolution(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Saisissez ou générez une solution de référence pour cet examen..."
                />
              </CardContent>
              <CardFooter className="flex justify-between py-4 border-t">
                <Button variant="outline" onClick={() => router.push(`/dashboard/exams/${examId}`)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveSolution}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer la solution
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="exam" className="mt-0">
            <Card className="shadow-md hover:shadow-lg transition-all border-t-4 border-t-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Sujet de l'examen
                </CardTitle>
                <CardDescription>
                  Consultez le document d'examen pour référence
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 h-[600px] overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800/50">
                <ExamViewer fileUrl={exam?.fileUrl || ''} format={exam?.format || 'PDF'} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 