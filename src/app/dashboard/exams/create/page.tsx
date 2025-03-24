// src/app/dashboard/exams/create/page.tsx
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, 
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash, Save, FileUp, ChevronRight, ChevronLeft, Database, BarChart3, FileText, Code } from "lucide-react";
import {Exam, ExamFormat, ExamSubject} from "@/types/exam";
import { examService } from "@/services/examService";
import { toast } from "sonner";
import { classService } from "@/services/class.service";
import { Class } from "@/types/class";
import { DatabaseExamType } from "@/types/exam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks } from "lucide-react";

export default function CreateExamPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [classes, setClasses] = useState<Class[]>([]);
  
  const [examData, setExamData] = useState({
    title: "",
    subject: DatabaseExamType.SQL,
    description: "",
    format: "PDF" as ExamFormat,
    file: null as File | null,
    classId: "",
    endDate: "",
  });
  
  const [questions, setQuestions] = useState([
    { id: "1", points: 1, order: 0 }
  ]);
  
  const [activeTab, setActiveTab] = useState("details");
  
  // Ajouter un nouvel état pour suivre l'étape de création
  const [creationStep, setCreationStep] = useState<'idle' | 'creating' | 'redirecting'>('idle');
  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        let data;
        if (user?.role === 'ADMIN') {
          data = await classService.getAllClasses();
        } else if (user?.role === 'PROFESSOR') {
          data = await classService.getProfessorClasses();
        }
        setClasses(data || []);
      } catch (error) {
        toast.error("Erreur lors du chargement des classes");
      }
    };

    if (user?.role === 'PROFESSOR' || user?.role === 'ADMIN') {
      fetchClasses();
    }
  }, [user?.role]);
  
  const updateExamData = (field: string, value: string | File | null) => {
    setExamData({
      ...examData,
      [field]: value
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type based on selected format
      const allowedTypes = {
        'PDF': ['application/pdf'],
        'TEX': ['application/x-tex', 'text/x-tex'],
        'MD': ['text/markdown', 'text/x-markdown'],
        'TXT': ['text/plain']
      };
  
      const allowedTypesForFormat = allowedTypes[examData.format];
      if (!allowedTypesForFormat?.includes(file.type)) {
        toast.error(`Seuls les fichiers ${examData.format} sont acceptés`);
        return;
      }
      
      // Check file size (5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        toast.error("La taille du fichier ne doit pas dépasser 5MB");
        return;
      }
  
      updateExamData('file', file);
    }
  };
  
  const updateQuestion = (id: string, field: string, value: any) => {
    // If updating points, check if new total would exceed 20
    if (field === 'points') {
      const currentQuestionPoints = questions.find(q => q.id === id)?.points || 0;
      const otherQuestionsTotal = questions.reduce((total, q) => 
        q.id === id ? total : total + (q.points || 0), 0);
      const newTotal = otherQuestionsTotal + value;
      
      if (newTotal > 20) {
        toast.error("Le total des points ne peut pas dépasser 20");
        return;
      }
    }
    
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };
  
  const addQuestion = () => {
    const currentTotal = questions.reduce((total, q) => total + (q.points || 0), 0);
    if (currentTotal >= 20) {
      toast.error("Le total des points ne peut pas dépasser 20");
      return;
    }
  
    const newId = (questions.length + 1).toString();
    const newOrder = questions.length;
    const remainingPoints = Math.min(1, 20 - currentTotal);
    setQuestions([...questions, { id: newId, points: remainingPoints, order: newOrder }]);
  };
  
  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const calculateTotalPoints = () => {
    return questions.reduce((total, q) => total + q.points, 0);
  };
  
  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    try {
      if (!examData.title || !examData.subject || !examData.classId || !examData.endDate) {
        toast.error("Veuillez remplir tous les champs obligatoires, y compris la date de fin");
        return;
      }

      // Vérifier que la date de fin est dans le futur
      const endDate = new Date(examData.endDate);
      if (endDate <= new Date()) {
        toast.error("La date de fin doit être dans le futur");
        return;
      }

      if (!examData.file) {
        toast.error("Erreur de validation", {
          description: "Veuillez ajouter un fichier PDF pour l'examen"
        });
        return;
      }

      // Passer à l'étape de création
      setCreationStep('creating');

      let fileUrl;

      try {
        fileUrl = await examService.uploadFile(examData.file);
      } catch (error) {
        toast.error("Erreur lors de l'upload du fichier");
        setCreationStep('idle');
        return;
      }

      const formattedQuestions = questions.map(q => ({
        id: q.id,
        points: q.points,
        order: q.order,
      }));

      const examPayload = {
        title: examData.title,
        subject: examData.subject,
        description: examData.description,
        format: examData.format,
        status: status,
        questions: formattedQuestions,
        fileUrl,
        totalPoints: calculateTotalPoints(),
        classId: examData.classId,
        endDate: examData.endDate,
      };

      const createdExam = await examService.createExam(examPayload);

      toast.success("Succès", {
        description: status === 'PUBLISHED' 
          ? "L'examen a été créé. Préparation de la solution de référence..." 
          : "L'examen a été enregistré comme brouillon"
      });

      if (status === 'PUBLISHED') {
        // Passer à l'étape de redirection avec un délai
        setCreationStep('redirecting');
        
        // Attendre 2 secondes avant de rediriger
        setTimeout(() => {
          router.push(`/dashboard/exams/${createdExam.id}/reference-solution`);
        }, 2000);
      } else {
        router.push('/dashboard/exams');
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la création de l'examen");
      setCreationStep('idle');
    }
  };

  // Ajoutez cette fonction pour obtenir l'icône correspondant au type d'examen
  const getExamTypeIcon = (subject: string) => {
    switch(subject.toUpperCase()) {
      case 'SQL':
        return <Database className="h-4 w-4 mr-2 text-blue-500" />;
      case 'DATABASE':
        return <Database className="h-4 w-4 mr-2 text-purple-500" />;
      case 'ALGORITHM':
        return <BarChart3 className="h-4 w-4 mr-2 text-amber-500" />;
      case 'PROGRAMMING':
        return <Code className="h-4 w-4 mr-2 text-emerald-500" />;
      default:
        return <FileText className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  if (user?.role !== 'PROFESSOR' && user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Accès non autorisé</h2>
            <p className="text-muted-foreground">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (creationStep === 'redirecting') {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 text-center max-w-md">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h2 className="text-xl font-semibold">Préparation de la solution de référence</h2>
          <p className="text-muted-foreground">
            Nous préparons l'environnement pour la création de la solution de référence...
          </p>
        </div>
      </div>
    );
  }

  if (creationStep === 'creating') {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 text-center max-w-md">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h2 className="text-xl font-semibold">Création de l'examen</h2>
          <p className="text-muted-foreground">
            Nous créons votre examen, veuillez patienter un instant...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-background sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              <BreadcrumbPage>Créer un examen</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 container max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Créer un nouveau sujet d'examen</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleSubmit('DRAFT')} className="gap-2">
              <Save className="h-4 w-4" />
              Enregistrer comme brouillon
            </Button>
            {activeTab === "grading" && (
              <Button onClick={() => handleSubmit('PUBLISHED')} className="gap-2 bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4" />
                Publier
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Détails de l'examen
            </TabsTrigger>
            <TabsTrigger value="grading" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Barème des questions
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                {calculateTotalPoints()}/20
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-0">
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">Titre de l'examen</Label>
                      <Textarea 
                        id="title" 
                        placeholder="Ex: Examen final de mathématiques" 
                        value={examData.title}
                        onChange={(e) => updateExamData('title', e.target.value)}
                        className="resize-none h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">Type d'examen</Label>
                      <Select
                        value={examData.subject}
                        onValueChange={(value) => updateExamData('subject', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(DatabaseExamType).map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              <div className="flex items-center">
                                {getExamTypeIcon(subject)}
                                <span>
                                  {subject === 'SQL' ? 'SQL' :
                                   subject === 'DATABASE' ? 'Base de données' :
                                   subject === 'ALGORITHM' ? 'Algorithmes' :
                                   'Programmation'}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class" className="text-sm font-medium">Classe</Label>
                      <Select 
                        value={examData.classId}
                        onValueChange={(value) => updateExamData('classId', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une classe" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((classItem) => (
                            <SelectItem key={classItem.id} value={classItem.id}>
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-sm font-medium">Date de fin</Label>
                      <Input
                        type="datetime-local"
                        id="endDate"
                        value={examData.endDate}
                        onChange={(e) => updateExamData('endDate', e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Description de l'examen..." 
                      value={examData.description}
                      onChange={(e) => updateExamData('description', e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="format" className="text-sm font-medium">Format du fichier</Label>
                      <Select
                        value={examData.format}
                        onValueChange={(value: ExamFormat) => updateExamData('format', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="TEX">LaTeX (TEX)</SelectItem>
                          <SelectItem value="MD">Markdown (MD)</SelectItem>
                          <SelectItem value="TXT">Texte (TXT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Document d'examen</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50">
                      <input
                        type="file"
                        accept={`.${examData.format.toLowerCase()}`}
                        onChange={handleFileChange}
                        className="hidden"
                        id="exam-file"
                      />
                      <label htmlFor="exam-file" className="cursor-pointer block">
                        <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium mb-1">
                          {examData.file ? examData.file.name : `Déposer votre fichier ${examData.format}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {!examData.file && "Glissez-déposez un fichier ici, ou cliquez pour parcourir"}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setActiveTab("grading")} 
                className="gap-2"
              >
                Continuer vers le barème
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="grading" className="mt-0">
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Barème des questions</h2>
                  <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    Total des points: {calculateTotalPoints()}/20
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="shadow-sm py-0 border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="bg-muted/50 px-6 py-3 border-b">
                        <h3 className="text-md font-medium">Question {index + 1}</h3>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                              Définissez le nombre de points pour cette question
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-32">
                              <Label htmlFor={`points-${question.id}`} className="sr-only">Points</Label>
                              <Input 
                                id={`points-${question.id}`} 
                                type="number" 
                                min="0"
                                max="20"
                                value={question.points}
                                onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 0)}
                                className="text-center"
                              />
                            </div>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => removeQuestion(question.id)}
                              disabled={questions.length <= 1}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full py-6 text-primary border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
                  onClick={addQuestion}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Ajouter une question
                </Button>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setActiveTab("details")
                }} 
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Retour aux détails
              </Button>
              
              <Button 
                onClick={() => handleSubmit('PUBLISHED')} 
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4" />
                Publier l'examen
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}