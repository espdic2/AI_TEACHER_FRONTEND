"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "@/store/hooks"
import { classService } from "@/services/class.service"
import { Class } from "@/types/class"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Settings, Trash, PlusCircle, Search, School, Users, GraduationCap, Trash2, Plus, Eye } from "lucide-react"
import { EditClassDialog } from "@/components/ui/edit-class-dialog"
import { DeleteClassesDialog } from "@/components/ui/delete-classes-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { Calculator } from "lucide-react"

export default function ClassesPage() {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditClass, setShowEditClass] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [classToDelete, setClassToDelete] = useState<string | null>(null)

  const fetchClasses = async () => {
    try {
      const data = await classService.getAllClasses()
      if (data) {
        setClasses(data)
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des classes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchClasses()
    }
  }, [user?.role])

  if (user?.role !== 'ADMIN') {
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
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Chargement des classes...</p>
        </div>
      </div>
    )
  }

  const handleViewClass = (classId: string) => {
    router.push(`/dashboard/my-classes/${classId}`)
  }

  const handleUpdateClass = async (data: any) => {
    try {
      if (!selectedClass) return
      await classService.updateClass(selectedClass.id, data)
      toast.success("La classe a été mise à jour avec succès")
      fetchClasses()
      setShowEditClass(false)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la classe")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClasses(new Set(classes.map(c => c.id)))
    } else {
      setSelectedClasses(new Set())
    }
  }

  const handleSelectClass = (classId: string, checked: boolean) => {
    const newSelected = new Set(selectedClasses)
    if (checked) {
      newSelected.add(classId)
    } else {
      newSelected.delete(classId)
    }
    setSelectedClasses(newSelected)
  }

  const handleDeleteSelected = async () => {
    try {
      await classService.deleteClasses(Array.from(selectedClasses))
      toast.success(`${selectedClasses.size} classe(s) supprimée(s) avec succès`)
      setSelectedClasses(new Set())
      fetchClasses()
    } catch (error) {
      toast.error("Erreur lors de la suppression des classes")
    }
    setShowDeleteDialog(false)
  }

  const handleDeleteClass = async (classId: string) => {
    try {
      await classService.deleteClass(classId)
      setClasses(prev => prev.filter(c => c.id !== classId))
      toast.success("La classe a été supprimée avec succès")
      setClassToDelete(null)
    } catch (error) {
      toast.error("Erreur lors de la suppression de la classe")
    }
  }

  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classItem.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  return (
    <>
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
                <BreadcrumbPage className="font-semibold">Classes</BreadcrumbPage>
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
              <School className="h-6 w-6 text-blue-600" />
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
              <p className="text-sm font-medium text-muted-foreground">Total Étudiants</p>
              <h3 className="text-3xl font-bold text-green-600">
                {filteredClasses.reduce((acc, curr) => acc + (curr.students?.length || 0), 0)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Calculator className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Moyenne Étudiants/Classe</p>
              <h3 className="text-3xl font-bold text-amber-600">
                {Math.round(filteredClasses.reduce((acc, curr) => acc + (curr.students?.length || 0), 0) / filteredClasses.length || 0)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Management Section */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <School className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Gestion des Classes</h2>
                  <p className="text-muted-foreground text-sm">Gérez toutes les classes de l'établissement</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher une classe..." 
                    className="pl-9 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {selectedClasses.size > 0 ? (
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Supprimer {selectedClasses.size} classe{selectedClasses.size > 1 ? 's' : ''}
                  </Button>
                ) : (
                  <Button onClick={() => router.push('/dashboard/my-classes/create')} className="gap-2">
                    <Plus className="h-4 w-4" />
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
                        checked={selectedClasses.size === classes.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Professeur</TableHead>
                    <TableHead className="text-center">Nombre d'étudiants</TableHead>
                    <TableHead className="text-center">Nombre d'examens</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedClasses.has(classItem.id)}
                          onCheckedChange={(checked) => handleSelectClass(classItem.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="font-medium">
                          {classItem.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <span className="truncate block">{classItem.description}</span>
                      </TableCell>
                      <TableCell>{classItem.professor.name}</TableCell>
                      <TableCell className="text-center">{classItem.students?.length}</TableCell>
                      <TableCell className="text-center">{classItem.exams?.length}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedClass(classItem)
                              setShowEditClass(true)
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => setClassToDelete(classItem.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleViewClass(classItem.id)}
                          >
                            <Eye className="h-4 w-4" />
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
    </div>
    </>
  )
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