import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LineChart, BarChart } from "@/components/ui/charts";
import { examService } from "@/services/examService";
import { toast } from "sonner";
import {
  GraduationCap,
  FileText,
  Users,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from "lucide-react";
import { LoadingScreen } from "@/components/ui/loading-screen";

export function ProfessorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    examsPendingGrading: 0,
    averageScore: 0,
    examStats: {
      completed: 0,
      inProgress: 0,
      pending: 0
    },
    classPerformance: [],
    upcomingExams: []
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await examService.getProfessorStats();
        setStats(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <LoadingScreen message="Chargement des statistiques..." />;
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Classes actives
            </p>
            <Button 
              variant="link" 
              className="px-0 text-xs text-blue-600" 
              onClick={() => router.push('/dashboard/my-classes')}
            >
              Gérer les classes <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Étudiants</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Total des étudiants
            </p>
            <Progress className="mt-2" value={(stats.totalStudents / 100) * 100} />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Examens à Noter</CardTitle>
            <FileText className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.examsPendingGrading}</div>
            <p className="text-xs text-muted-foreground">
              En attente de correction
            </p>
            {stats.examsPendingGrading > 0 && (
              <Button 
                variant="link" 
                className="px-0 text-xs text-amber-600" 
                onClick={() => router.push('/dashboard/exams')}
              >
                Corriger maintenant <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <Award className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}/20</div>
            <p className="text-xs text-muted-foreground">
              Moyenne des examens
            </p>
            <Progress className="mt-2" value={(stats.averageScore / 20) * 100} />
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="upcoming">Examens à venir</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Distribution des examens</CardTitle>
                <CardDescription>Répartition des examens par statut</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart
                  data={[
                    { name: "Terminés", value: stats.examStats.completed },
                    { name: "En cours", value: stats.examStats.inProgress },
                    { name: "À noter", value: stats.examStats.pending },
                  ]}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Performance par classe</CardTitle>
                <CardDescription>Moyennes par classe</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] pr-4">
                  {stats.classPerformance.map((classItem, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{classItem.name}</span>
                        <span className="text-sm">{classItem.average.toFixed(1)}/20</span>
                      </div>
                      <Progress value={(classItem.average / 20) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {classItem.studentCount} étudiants
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Examens à venir</CardTitle>
              <CardDescription>Prochains examens programmés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.upcomingExams.map((exam, index) => (
                  <Card key={index} className="overflow-hidden border-l-4 hover:shadow-md transition-shadow"
                    style={{ borderLeftColor: exam.isUrgent ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)' }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{exam.title}</h3>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{exam.subject}</span>
                            <span className="mx-1">•</span>
                            <Calendar className="h-3 w-3" />
                            <span>Date: {exam.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {exam.isUrgent && (
                            <Badge variant="destructive" className="mr-2">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                          <Button 
                            size="sm"
                            onClick={() => router.push(`/dashboard/exams/${exam.id}`)}
                          >
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu des classes</CardTitle>
              <CardDescription>État et performance des classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.classPerformance.map((classItem, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{classItem.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            {classItem.studentCount} étudiants • Moyenne: {classItem.average.toFixed(1)}/20
                          </div>
                        </div>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/my-classes/${classItem.id}`)}
                        >
                          Gérer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 