"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { userService } from "@/services/user.service";
import { User } from "@/types/user";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { classService } from "@/services/class.service";

export default function UserDetailsPage() {
  const { userId } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [user, setUser] = useState<User | null>(null);
  const [userClasses, setUserClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: ""
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await userService.getUserById(userId as string);
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role
        });
        
        // Charger les classes en fonction du rôle
        let userClassesData;
        if (userData.role === 'PROFESSOR') {
          // Pour un professeur, obtenir les classes qu'il enseigne
          userClassesData = await classService.getProfessorClassesById(userData.id);
        } else {
          // Pour les autres (étudiants), obtenir les classes auxquelles ils appartiennent
          userClassesData = await userService.getUserClasses(userId as string);
        }
        setUserClasses(userClassesData);
      } catch (error) {
        toast.error("Erreur lors du chargement des données de l'utilisateur");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.updateUser(userId as string, formData);
      toast.success("Utilisateur mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  if (currentUser?.role !== 'ADMIN') {
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
    return <div>Chargement...</div>;
  }

  return (
    <>
      <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/users">Utilisateurs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Détails de l'utilisateur</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rôle</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STUDENT">Étudiant</SelectItem>
                        <SelectItem value="PROFESSOR">Professeur</SelectItem>
                        <SelectItem value="ADMIN">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit">Enregistrer les modifications</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {user?.role === 'PROFESSOR' 
                  ? "Classes enseignées"
                  : "Classes suivies"
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom de la classe</TableHead>
                    {user?.role === 'PROFESSOR' ? (
                      <>
                        <TableHead>Nombre d'étudiants</TableHead>
                        <TableHead>Nombre d'examens</TableHead>
                        <TableHead>Statut</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead>Professeur</TableHead>
                        <TableHead>Moyenne</TableHead>
                        <TableHead>Statut</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userClasses.map((classItem: any) => (
                    <TableRow key={classItem.id}>
                      <TableCell>{classItem.name}</TableCell>
                      {user?.role === 'PROFESSOR' ? (
                        <>
                          <TableCell>{classItem.studentCount}</TableCell>
                          <TableCell>{classItem.examCount}</TableCell>
                          <TableCell>{classItem.status}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{classItem.professor.name}</TableCell>
                          <TableCell>
                            {classItem.studentAverage ? 
                              `${classItem.studentAverage}/20` : 
                              'Pas de note'
                            }
                          </TableCell>
                          <TableCell>{classItem.status}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 