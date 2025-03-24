"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { classService } from "@/services/class.service";
import { Class, ClassStudent } from "@/types/class";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AddUsersDialog } from "@/components/add-users-dialog";
import { DeleteStudentDialog } from "@/components/ui/delete-student-dialog";
import { UserPlus, Trash2, Settings, Search, BookOpen, Users, GraduationCap, Award, FileText, Calendar } from "lucide-react";
import { EditClassDialog } from "@/components/ui/edit-class-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function ClassDetailsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const params = useParams();
  const [classDetails, setClassDetails] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddUsers, setShowAddUsers] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showEditClass, setShowEditClass] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const data = await classService.getClassDetails(params.classId as string);
      setClassDetails(data);
    } catch (error) {
      toast.error("Impossible de charger les détails de la classe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, [params.classId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Chargement des détails de la classe...</p>
        </div>
      </div>
    );
  }
  
  if (!classDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Classe non trouvée</h2>
            <p className="text-muted-foreground mb-4">
              La classe que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <Button onClick={() => router.push('/dashboard/my-classes')}>
              Retour aux classes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculer la moyenne pour chaque étudiant
  const getStudentAverage = (student: ClassStudent) => {
    if (!student.studentExams || student.studentExams.length === 0) {
      return null;
    }
    
    const completedExams = student.studentExams.filter(exam => exam.status === 'GRADED');
    if (completedExams.length === 0) return null;
    
    const totalScore = completedExams.reduce((sum, exam) => sum + (exam.score || 0), 0);
    return (totalScore / completedExams.length).toFixed(2);
  };

  // Obtenir le dernier examen noté
  const getLastGradedExam = (student: ClassStudent) => {
    if (!student.studentExams || student.studentExams.length === 0) {
      return null;
    }

    const gradedExams = student.studentExams
      .filter(exam => exam.status === 'GRADED' && exam.score !== null)
      .sort((a, b) => new Date(b.exam.id).getTime() - new Date(a.exam.id).getTime());
    
    return gradedExams[0] || null;
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      await classService.removeStudentFromClass(params.classId as string, studentToDelete.id);
      toast.success(`L'étudiant ${studentToDelete.name} a été retiré de la classe`);
      fetchClassDetails(); // Recharger les détails de la classe
      setStudentToDelete(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'étudiant");
    }
  };

  const handleUpdateClass = async (data: any) => {
    try {
      await classService.updateClass(params.classId as string, data);
      toast.success("La classe a été mise à jour avec succès");
      fetchClassDetails();
      setShowEditClass(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la classe");
    }
  };

  // Calculer les statistiques de la classe
  const calculateClassStats = () => {
    const totalStudents = classDetails.students.length;
    const studentsWithGrades = classDetails.students.filter(student => getStudentAverage(student) !== null).length;
    const classAverage = classDetails.students.reduce((sum, student) => {
      const avg = getStudentAverage(student);
      return sum + (avg ? parseFloat(avg) : 0);
    }, 0) / (studentsWithGrades || 1);

    return {
      totalStudents,
      studentsWithGrades,
      classAverage: classAverage.toFixed(2),
      completionRate: totalStudents ? (studentsWithGrades / totalStudents) * 100 : 0
    };
  };

  const stats = calculateClassStats();

  // Filtrer les étudiants en fonction de la recherche
  const filteredStudents = classDetails.students.filter(student => 
    student.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
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
              <BreadcrumbLink href="/dashboard/my-classes" className="text-muted-foreground hover:text-primary">
                Mes Classes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">{classDetails.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Class Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{classDetails.name}</h1>
              <p className="text-muted-foreground">
                {classDetails.description || "Aucune description"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {user?.role === 'ADMIN' && (
              <>
                <Button onClick={() => setShowEditClass(true)} variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Modifier
                </Button>
                <Button onClick={() => setShowAddUsers(true)} className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Ajouter des étudiants
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Étudiants</p>
                <h3 className="text-3xl font-bold text-blue-600">{stats.totalStudents}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Examens</p>
                <h3 className="text-3xl font-bold text-green-600">
                  {classDetails.exams?.length || 0}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Moyenne</p>
                <h3 className="text-3xl font-bold text-amber-600">
                  {stats.classAverage}/20
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Progression</p>
                <h3 className="text-3xl font-bold text-purple-600">
                  {Math.round(stats.completionRate)}%
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="students">Étudiants</TabsTrigger>
            <TabsTrigger value="exams">Examens</TabsTrigger>
            <TabsTrigger value="info">Informations</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>Liste des étudiants</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un étudiant..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Moyenne</TableHead>
                        <TableHead>Dernier examen</TableHead>
                        <TableHead>Progression</TableHead>
                        {user?.role === 'ADMIN' && <TableHead className="text-right">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={user?.role === 'ADMIN' ? 6 : 5} className="text-center py-8 text-muted-foreground">
                            Aucun étudiant trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student) => {
                          const average = getStudentAverage(student);
                          const lastExam = getLastGradedExam(student);
                          const completedExams = student.studentExams?.filter(exam => exam.status === 'GRADED').length || 0;
                          const totalExams = student.studentExams?.length || 0;
                          const progressPercentage = totalExams > 0 ? (completedExams / totalExams) * 100 : 0;
                          
                          return (
                            <TableRow key={student.student.id}>
                              <TableCell className="font-medium">{student.student.name}</TableCell>
                              <TableCell>{student.student.email}</TableCell>
                              <TableCell>
                                {average ? (
                                  <Badge variant={parseFloat(average) >= 10 ? "success" : "destructive"} className="font-medium">
                                    {average}/20
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground">Pas de note</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {lastExam ? (
                                  <div className="flex flex-col">
                                    <Badge variant={lastExam.score >= 10 ? "success" : "destructive"} className="w-fit mb-1">
                                      {lastExam.score}/20
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {lastExam.exam.title}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Pas d'examen noté</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>{completedExams}/{totalExams} examens</span>
                                    <span>{Math.round(progressPercentage)}%</span>
                                  </div>
                                  <Progress value={progressPercentage} className="h-2" />
                                </div>
                              </TableCell>
                              {user?.role === 'ADMIN' && (
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setStudentToDelete({
                                      id: student.student.id,
                                      name: student.student.name
                                    })}
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Examens de la classe</CardTitle>
                <CardDescription>Liste des examens associés à cette classe</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {classDetails.exams && classDetails.exams.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {classDetails.exams.map((exam) => (
                      <Card key={exam.id} className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-2">
                            <h3 className="font-semibold">{exam.title}</h3>
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center gap-1 mb-1">
                                <FileText className="h-3.5 w-3.5" />
                                <span>{exam.subject}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Date limite: {new Date(exam.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => router.push(`/dashboard/exams/${exam.id}`)}
                              >
                                Voir les détails
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium mb-1">Aucun examen</h3>
                    <p>Cette classe n'a pas encore d'examens associés.</p>
                    {user?.role === 'ADMIN' || user?.role === 'PROFESSOR' ? (
                      <Button 
                        className="mt-4"
                        onClick={() => router.push('/dashboard/exams/create')}
                      >
                        Créer un examen
                      </Button>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Informations sur la classe</CardTitle>
                <CardDescription>Détails et statistiques</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Détails</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Nom de la classe</h4>
                        <p>{classDetails.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                        <p>{classDetails.description || "Aucune description"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Professeur</h4>
                        <p>{classDetails.professor.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Date de création</h4>
                        <p>{new Date(classDetails.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Nombre d'étudiants</h4>
                        <p>{stats.totalStudents}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Nombre d'examens</h4>
                        <p>{classDetails.exams?.length || 0}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Moyenne de la classe</h4>
                        <p>{stats.classAverage}/20</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Taux de complétion</h4>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs">
                            <span>{stats.studentsWithGrades}/{stats.totalStudents} étudiants notés</span>
                            <span>{Math.round(stats.completionRate)}%</span>
                          </div>
                          <Progress value={stats.completionRate} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {user?.role === 'ADMIN' && (
          <>
            <EditClassDialog
              open={showEditClass}
              onOpenChange={setShowEditClass}
              onConfirm={handleUpdateClass}
              initialData={{
                name: classDetails.name,
                description: classDetails.description,
                professorId: classDetails.professor.id,
              }}
            />
            <AddUsersDialog
              classId={params.classId as string}
              open={showAddUsers}
              onOpenChange={setShowAddUsers}
              onUsersAdded={() => {
                fetchClassDetails();
              }}
            />
            <DeleteStudentDialog
              open={!!studentToDelete}
              onOpenChange={(open) => !open && setStudentToDelete(null)}
              onConfirm={handleDeleteStudent}
              studentName={studentToDelete?.name || ''}
            />
          </>
        )}
      </div>
    </div>
  );
} 