"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, 
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash, Save, FileUp, AlertCircle, CheckCircle2, FileQuestion, BookOpen, Calendar, Award, Database, BarChart3, FileText, Code } from "lucide-react";
import { ExamFormat, DatabaseExamType, Exam, Question } from "@/types/exam";
import { examService } from "@/services/examService";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { DeleteExamDialog } from "@/components/ui/delete-exam-dialog";
import { classService } from "@/services/class.service";
import { Class } from "@/types/class";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [examData, setExamData] = useState<Partial<Exam>>({
    title: "",
    subject: "",
    description: "",
    format: "PDF" as ExamFormat,
    status: "DRAFT",
    questions: [],
    totalPoints: 0,
    fileUrl: "",
    classId: "",
    file: null as File | null
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const exam = await examService.getExamById(examId);
        
        let classesData;
        if (user?.role === 'ADMIN') {
          classesData = await classService.getAllClasses();
        } else if (user?.role === 'PROFESSOR') {
          classesData = await classService.getProfessorClasses();
        }
        
        setClasses(classesData || []);
        setExamData({
          ...exam,
          questions: exam.questions || []
        });
      } catch (error) {
        toast.error("Erreur lors du chargement de l'examen");
        console.error("Error fetching exam:", error);
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchData();
    }
  }, [examId, user?.role]);

  const updateExamData = (field: string, value: any) => {
    setExamData(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      points: 1,
      order: (examData.questions?.length || 0) + 1,
      content: "",
    };
    
    setExamData(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    if (field === 'points') {
      const currentQuestionPoints = examData.questions?.[index]?.points || 0;
      const otherQuestionsTotal = examData.questions?.reduce((total, q, i) => 
        i === index ? total : total + (q.points || 0), 0) || 0;
      const newTotal = otherQuestionsTotal + value;
      
      if (newTotal > 20) {
        toast.error("Le total des points ne peut pas dépasser 20");
        return;
      }
    }
  
    setExamData(prev => ({
      ...prev,
      questions: prev.questions?.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestion = (index: number) => {
    if ((examData.questions || []).length <= 1) {
      toast.error("Un examen doit avoir au moins une question");
      return;
    }
    
    const updatedQuestions = (examData.questions || []).filter((_, i) => i !== index);
    const reorderedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      order: i + 1
    }));
    setExamData(prev => ({ ...prev, questions: reorderedQuestions }));
  };

  const calculateTotalPoints = () => {
    return (examData.questions || []).reduce((total, q) => total + (q.points || 0), 0);
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

      setExamData(prev => ({
        ...prev,
        file: file,
        fileUrl: URL.createObjectURL(file) // Pour prévisualisation temporaire
      }));
      
      toast.success(`Fichier ${file.name} ajouté avec succès`);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Vérifier le type de fichier
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
      
      // Vérifier la taille du fichier
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        toast.error("La taille du fichier ne doit pas dépasser 5MB");
        return;
      }

      setExamData(prev => ({
        ...prev,
        file: file,
        fileUrl: URL.createObjectURL(file)
      }));
      
      toast.success(`Fichier ${file.name} ajouté avec succès`);
    }
  };

  const saveExam = async (status: 'DRAFT' | 'PUBLISHED') => {
    try {
      // Check required fields
      if (!examData.title || !examData.subject || !examData.classId) {
        toast.error("Veuillez remplir tous les champs obligatoires, y compris la classe");
        return;
      }

      // Only require file when publishing
      if (status === 'PUBLISHED' && !examData.file && !examData.fileUrl) {
        toast.error(`Veuillez ajouter un fichier ${examData.format} pour publier l'examen`);
        return;
      }

      let fileUrl = examData.fileUrl;
      
      if (examData.file) {
        try {
          // Check file type based on selected format
          const allowedTypes = {
            'PDF': ['application/pdf'],
            'TEX': ['application/x-tex', 'text/x-tex'],
            'MD': ['text/markdown', 'text/x-markdown'],
            'TXT': ['text/plain']
          };

          const allowedTypesForFormat = allowedTypes[examData.format];
          if (!allowedTypesForFormat?.includes(examData.file.type)) {
            toast.error(`Seuls les fichiers ${examData.format} sont acceptés`);
            return;
          }

          fileUrl = await examService.uploadFile(examData.file, examId);
        } catch (error) {
          toast.error("Erreur lors de l'upload du fichier");
          return;
        }
      }

      const formattedQuestions = examData.questions?.map(q => ({
        id: q.id,
        points: q.points,
        order: q.order,
        content: q.content,
      }));

      const examPayload = {
        ...examData,
        id: examId,
        status,
        fileUrl,
        file: undefined,
        format: examData.format,
        totalPoints: calculateTotalPoints(),
        questions: formattedQuestions
      };

      await examService.updateExam(examPayload);
      toast.success(
        status === 'PUBLISHED' 
          ? "L'examen a été publié avec succès"
          : "L'examen a été enregistré comme brouillon"
      );

      router.push('/dashboard/exams');
    } catch (error) {
      console.error("Error saving exam:", error);
      toast.error("Une erreur est survenue lors de la sauvegarde de l'examen");
    }
  };

  const handleDeleteExam = async () => {
    try {
      await examService.deleteExam(examId);
      toast.success("L'examen a été supprimé avec succès");
      router.push('/dashboard/exams');
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'examen");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Chargement de l'examen...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'PROFESSOR' && user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Accès non autorisé</CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push('/dashboard')}>
              Retour au Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const getFormatIcon = (format: ExamFormat) => {
    switch (format) {
      case 'PDF': return '📄';
      case 'TEX': return '📝';
      case 'MD': return '📋';
      case 'TXT': return '📃';
      default: return '📄';
    }
  };

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

  return (
    <>
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
              <BreadcrumbPage>Modifier l'examen</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Modifier le sujet d'examen</h1>
            <p className="text-muted-foreground mt-1">
              {examData.status === 'DRAFT' ? 
                <Badge variant="secondary">Brouillon</Badge> : 
                <Badge variant="success">Publié</Badge>
              }
              <span className="ml-2">Dernière modification: {new Date().toLocaleDateString()}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="text-destructive border-destructive hover:bg-destructive/10" 
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
            <Button variant="outline" onClick={() => saveExam('DRAFT')}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer comme brouillon
            </Button>
            <Button onClick={() => saveExam('PUBLISHED')}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Publier
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-4 bg-background">
            <TabsTrigger value="details">Détails de l'examen</TabsTrigger>
            <TabsTrigger value="questions">Questions et barème</TabsTrigger>
            <TabsTrigger value="document">Document d'examen</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>
                  Définissez les informations de base de votre examen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base">Titre de l'examen <span className="text-red-500">*</span></Label>
                    <Input 
                      id="title" 
                      placeholder="Ex: Examen final de mathématiques" 
                      value={examData.title}
                      onChange={(e) => updateExamData('title', e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-base">Matière <span className="text-red-500">*</span></Label>
                    <Select 
                      value={examData.subject}
                      onValueChange={(value) => updateExamData('subject', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Sélectionner une matière" />
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
                    <Label htmlFor="class" className="text-base">Classe <span className="text-red-500">*</span></Label>
                    <Select 
                      value={examData.classId}
                      onValueChange={(value) => updateExamData('classId', value)}
                    >
                      <SelectTrigger className="h-12">
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
                    <Label htmlFor="endDate" className="text-base">Date limite</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={examData.endDate}
                      onChange={(e) => updateExamData('endDate', e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Description de l'examen..." 
                    value={examData.description}
                    onChange={(e) => updateExamData('description', e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format" className="text-base">Format du fichier</Label>
                  <Select
                    value={examData.format}
                    onValueChange={(value: ExamFormat) => updateExamData('format', value)}
                  >
                    <SelectTrigger className="h-12">
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
              </CardContent>
              <CardFooter className="flex justify-end border-t p-6">
                <Button onClick={() => setActiveTab("questions")}>
                  Continuer vers les questions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Questions et barème</CardTitle>
                <CardDescription>
                  Définissez les questions et leur pondération
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Total des points: {calculateTotalPoints()}/20</span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={addQuestion}
                    className="gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Ajouter une question
                  </Button>
                </div>

                {calculateTotalPoints() > 20 && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Attention</AlertTitle>
                    <AlertDescription>
                      Le total des points dépasse 20. Veuillez ajuster les points des questions.
                    </AlertDescription>
                  </Alert>
                )}

                {(examData.questions || []).length === 0 ? (
                  <div className="text-center p-12 border-2 border-dashed rounded-md">
                    <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune question</h3>
                    <p className="text-muted-foreground mb-4">
                      Ajoutez des questions pour définir le barème de l'examen
                    </p>
                    <Button onClick={addQuestion}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter une première question
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(examData.questions || []).map((question, index) => (
                      <Card key={question.id} className="border border-muted">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-base font-semibold">
                              Question {index + 1}
                            </Badge>
                            <div className="flex items-center gap-4">
                              <div className="w-32">
                                <Label htmlFor={`question-${index}-points`}>Points</Label>
                                <Input 
                                  id={`question-${index}-points`}
                                  type="number"
                                  min="1"
                                  max="20"
                                  value={String(question.points || 1)}
                                  onChange={(e) => {
                                    const value = e.target.value === '' ? 1 : Math.max(1, parseInt(e.target.value) || 1);
                                    updateQuestion(index, 'points', value);
                                  }}
                                  className="text-center"
                                />
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeQuestion(index)}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                <Button variant="outline" onClick={() => setActiveTab("details")}>
                  Retour aux détails
                </Button>
                <Button onClick={() => setActiveTab("document")}>
                  Continuer vers le document
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="document" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document d'examen</CardTitle>
                <CardDescription>
                  Téléchargez le document d'examen au format {examData.format}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className={`border-2 ${isDragging ? 'border-primary bg-primary/5' : 'border-dashed'} rounded-lg p-8 text-center transition-colors`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept={`.${examData.format.toLowerCase()}`}
                    onChange={handleFileChange}
                    className="hidden"
                    id="exam-file"
                  />
                  <label 
                    htmlFor="exam-file" 
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-2xl">{getFormatIcon(examData.format)}</span>
                    </div>
                    
                    {examData.file || examData.fileUrl ? (
                      <>
                        <p className="text-lg font-medium mb-2">
                          {examData.file 
                            ? examData.file.name 
                            : examData.fileUrl
                              ? examData.fileUrl.split('/').pop()
                              : ''}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Cliquez ou glissez-déposez pour remplacer le fichier
                        </p>
                        <Button variant="outline" size="sm">
                          <FileUp className="mr-2 h-4 w-4" />
                          Changer de fichier
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium mb-2">
                          Déposez votre fichier {examData.format} ici
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          ou cliquez pour sélectionner un fichier (max. 5MB)
                        </p>
                        <Button variant="outline" size="sm">
                          <FileUp className="mr-2 h-4 w-4" />
                          Parcourir les fichiers
                        </Button>
                      </>
                    )}
                  </label>
                </div>

                {!examData.file && !examData.fileUrl && (
                  <Alert className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Fichier requis pour la publication</AlertTitle>
                    <AlertDescription>
                      Un fichier {examData.format} est nécessaire pour publier l'examen. Vous pouvez enregistrer comme brouillon sans fichier.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                <Button variant="outline" onClick={() => setActiveTab("questions")}>
                  Retour aux questions
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => saveExam('DRAFT')}>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer comme brouillon
                  </Button>
                  <Button onClick={() => saveExam('PUBLISHED')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Publier l'examen
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DeleteExamDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteExam}
        examTitle={examData.title || ''}
      />
    </>
  );
}