"use client"

import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { classService } from "@/services/class.service";
import { Class } from "@/types/class";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { useRouter } from "next/navigation";
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
import { Settings, Trash2, PlusCircle, Search, School, Users, GraduationCap, Trash, BookOpen } from "lucide-react";
import { EditClassDialog } from "@/components/ui/edit-class-dialog";
import { DeleteClassesDialog } from "@/components/ui/delete-classes-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function MyClassesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditClass, setShowEditClass] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [averageStudentsPerClass, setAverageStudentsPerClass] = useState(0);

  const fetchClasses = async () => {
    try {
      let data;
      if (user?.role === 'ADMIN') {
        data = await classService.getAllClasses();
      } else if (user?.role === 'PROFESSOR') {
        data = await classService.getProfessorClasses();
      }

      if (data) {
        setClasses(data);
        setTotalStudents(data.reduce((acc, curr) => acc + (curr.students.length || 0), 0));
        setAverageStudentsPerClass(Math.round(data.reduce((acc, curr) => acc + curr.students.length, 0) / data.length || 0));
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'PROFESSOR' || user?.role === 'ADMIN') {
      fetchClasses();
    }
  }, [user?.role]);

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
    return <LoadingScreen message="Chargement des classes..." />;
  }

  const handleViewClass = (classId: string) => {
    router.push(`/dashboard/my-classes/${classId}`);
  };

  const handleUpdateClass = async (data: any) => {
    try {
      if (!selectedClass) return;
      await classService.updateClass(selectedClass.id, data);
      toast.success("La classe a été mise à jour avec succès");
      const fetchClasses = async () => {
        try {
          let data;
          if (user?.role === 'ADMIN') {
            data = await classService.getAllClasses();
          } else if (user?.role === 'PROFESSOR') {
            data = await classService.getProfessorClasses();
          }
          
          if (data) {
            setClasses(data);
            setTotalStudents(data.reduce((acc, curr) => acc + (curr.students.length || 0), 0));
            setAverageStudentsPerClass(Math.round(data.reduce((acc, curr) => acc + curr.students.length, 0) / data.length || 0));
          }
        } catch (error) {
          toast.error("Erreur lors du chargement des classes");
        }
      };
      fetchClasses();
      setShowEditClass(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la classe");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClasses(new Set(classes.map(c => c.id)));
    } else {
      setSelectedClasses(new Set());
    }
  };

  const handleSelectClass = (classId: string, checked: boolean) => {
    const newSelected = new Set(selectedClasses);
    if (checked) {
      newSelected.add(classId);
    } else {
      newSelected.delete(classId);
    }
    setSelectedClasses(newSelected);
  };

  const handleDeleteSelected = async () => {
    try {
      for (const classId of selectedClasses) {
        await classService.deleteClass(classId);
      }
      toast.success(`${selectedClasses.size} classe(s) supprimée(s) avec succès`);
      setSelectedClasses(new Set());
      fetchClasses();
    } catch (error) {
      toast.error("Erreur lors de la suppression des classes");
    }
    setShowDeleteDialog(false);
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await classService.deleteClass(classId);
      setClasses(prev => prev.filter(c => c.id !== classId));
      toast.success("La classe a été supprimée avec succès");
      setClassToDelete(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression de la classe");
    }
  };

  // Filtrer les classes en fonction de la recherche
  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classItem.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClasses(new Set(classes.map(c => c.id)));
    } else {
      setSelectedClasses(new Set());
    }
  };

  return (
    <>
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
                <BreadcrumbPage className="font-semibold">Mes Classes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <h3 className="text-3xl font-bold text-blue-600">{filteredClasses.length}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Étudiants</p>
                  <h3 className="text-3xl font-bold text-green-600">
                    {totalStudents}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <GraduationCap className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Moyenne</p>
                  <h3 className="text-3xl font-bold text-amber-600">
                    {averageStudentsPerClass}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Classes Management Section */}
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Mes Classes</h2>
                      <p className="text-muted-foreground text-sm">Gérez vos classes et vos étudiants</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher une classe..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 w-full"
                      />
                    </div>
                    {user?.role === 'ADMIN' && (
                      <Button 
                        onClick={() => router.push('/dashboard/my-classes/create')}
                        className="shrink-0 bg-primary/70 hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Créer une classe
                      </Button>
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox 
                            checked={selectedClasses.size === filteredClasses.length && filteredClasses.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Classe</TableHead>
                        <TableHead>Étudiants</TableHead>
                        <TableHead className="hidden md:table-cell">Date de création</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClasses.map((classItem) => (
                        <TableRow key={classItem.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedClasses.has(classItem.id)}
                              onCheckedChange={(checked) => 
                                handleSelectClass(classItem.id, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell>{classItem.name}</TableCell>
                          <TableCell>{classItem.students.length}</TableCell>
                          <TableCell className="hidden md:table-cell">{new Date(classItem.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              {user?.role === 'ADMIN' && (
                                <>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedClass(classItem);
                                      setShowEditClass(true);
                                    }}
                                  >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Modifier
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => setClassToDelete(classItem.id)}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Supprimer
                                  </Button>
                                </>
                              )}
                              <Button
                                onClick={() => handleViewClass(classItem.id)}
                              >
                                Voir les détails
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedClass && (
        <EditClassDialog
          open={showEditClass}
          onOpenChange={setShowEditClass}
          onConfirm={handleUpdateClass}
          initialData={{
            name: selectedClass.name,
            description: selectedClass.description || '',
            professorId: selectedClass.professor.id,
          }}
        />
      )}

      <DeleteClassesDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteSelected}
        count={selectedClasses.size}
      />

      <DeleteClassDialog
        open={!!classToDelete}
        onOpenChange={(open) => !open && setClassToDelete(null)}
        onConfirm={() => classToDelete && handleDeleteClass(classToDelete)}
        className="sm:max-w-[425px]"
      />
    </>
  );
}

function DeleteClassDialog({
  open,
  onOpenChange,
  onConfirm,
  className,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  className: string
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Cela supprimera définitivement la classe
            et toutes les données associées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 