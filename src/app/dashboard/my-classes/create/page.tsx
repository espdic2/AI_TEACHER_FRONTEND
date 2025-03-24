"use client"

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useState, useEffect } from "react";
import { classService } from "@/services/class.service";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userService } from "@/services/user.service";
import { User } from "@/types/user";
import { GraduationCap, Calendar, FileText, Users, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateClassPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [professors, setProfessors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    professorId: "",
  });
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        setPageLoading(true);
        const data = await userService.getProfessors();
        setProfessors(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des professeurs");
      } finally {
        setPageLoading(false);
      }
    };
    fetchProfessors();
  }, []);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md shadow-lg animate-in fade-in-50 duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <AlertCircle className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Accès non autorisé</h2>
            </div>
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <Button 
              className="w-full mt-6" 
              onClick={() => router.push('/dashboard')}
            >
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const validateDates = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        setDateError("La date de fin doit être postérieure à la date de début");
        return false;
      }
    }
    setDateError("");
    return true;
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData({ ...formData, [field]: value });
    if (formData.startDate && formData.endDate) {
      validateDates();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //console.log(formData);
    
    if (!validateDates()) {
      toast.error("Veuillez corriger les erreurs de date");
      return;
    }
    
    try {
      setLoading(true);
      await classService.createClass(formData);
      toast.success("Classe créée avec succès");
      router.push('/dashboard/classes');
    } catch (error) {
      toast.error("Erreur lors de la création de la classe");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

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
                Classes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">Créer une classe</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="container mx-auto p-6 max-w-4xl animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-muted/50 transition-colors group"
          onClick={() => router.push('/dashboard/my-classes')}
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
          Retour aux classes
        </Button>

        <Card className="border-none shadow-lg bg-gradient-to-br py-0 from-card/50 to-card overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6 pt-8 px-8 border-b">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-primary/10 p-2">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Créer une nouvelle classe</CardTitle>
            </div>
            <CardDescription className="text-base text-muted-foreground">
              Remplissez les informations ci-dessous pour créer une nouvelle classe
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium flex items-center">
                    Nom de la classe <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: Développement Web Avancé"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11 transition-all focus-visible:ring-primary/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professorId" className="text-base font-medium flex items-center">
                    Professeur responsable <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select
                    value={formData.professorId}
                    onValueChange={(value) => setFormData({ ...formData, professorId: value })}
                    required
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Sélectionner un professeur" />
                    </SelectTrigger>
                    <SelectContent>
                      {professors.map((professor) => (
                        <SelectItem key={professor.id} value={professor.id}>
                          {professor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium flex items-center">
                  Description <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le contenu et les objectifs de cette classe..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="min-h-[120px] resize-none transition-all focus-visible:ring-primary/70"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label 
                    htmlFor="startDate" 
                    className="text-base font-medium flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Date de début <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    required
                    className={cn(
                      "h-11 transition-all focus-visible:ring-primary/70",
                      dateError && "border-red-500 focus-visible:ring-red-500/70"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor="endDate" 
                    className="text-base font-medium flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Date de fin <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    required
                    className={cn(
                      "h-11 transition-all focus-visible:ring-primary/70",
                      dateError && "border-red-500 focus-visible:ring-red-500/70"
                    )}
                  />
                  {dateError && (
                    <p className="text-sm text-red-500 mt-1">{dateError}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/dashboard/my-classes')}
                  className="h-11 px-6"
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="h-11 px-6 bg-primary hover:bg-primary/90 text-white font-medium shadow-md hover:shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2"></div>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Créer la classe
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3 mt-8 animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-300">
          <Card className="bg-blue-500/10 border-none shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-500/20 p-3 group-hover:bg-blue-500/30 transition-colors">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Gestion des étudiants</h3>
                  <p className="text-sm mt-1">Ajoutez des étudiants à votre classe après sa création</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-500/10 border-none shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-500/20 p-3 group-hover:bg-green-500/30 transition-colors">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Création d'examens</h3>
                  <p className="text-sm mt-1">Créez des examens pour évaluer les connaissances des étudiants</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-500/10 border-none shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-amber-500/20 p-3 group-hover:bg-amber-500/30 transition-colors">
                  <GraduationCap className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Suivi des progrès</h3>
                  <p className="text-sm mt-1">Suivez les performances et la progression des étudiants</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}