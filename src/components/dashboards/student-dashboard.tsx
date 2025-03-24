import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LineChart } from "@/components/ui/charts";
import { examService } from "@/services/examService";
import { StudentExam, StudentExamStatus } from "@/types/studentExams";
import { 
  FileText, 
  GraduationCap, 
  Medal, 
  Clock, 
  Calendar, 
  BookOpen, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle,
  BarChart3
} from "lucide-react";
import { LoadingScreen } from "../ui/loading-screen";

export function StudentDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<StudentExam[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<StudentExam[]>([]);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [scoreProgress, setScoreProgress] = useState<{date: string, score: number}[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les résultats
        const resultsData = await examService.getStudentResults(user?.id || '');
        setResults(resultsData);
        
        // Charger les examens à venir
        const examsData = await examService.getStudentExams();
        setUpcomingExams(examsData.filter(exam => exam.status === StudentExamStatus.IN_PROGRESS));
        
        // Calculer la moyenne
        const gradedExams = resultsData.filter(exam => exam.score !== null);
        if (gradedExams.length > 0) {
          const sum = gradedExams.reduce((acc, exam) => acc + (exam.score || 0), 0);
          setAverageScore(parseFloat((sum / gradedExams.length).toFixed(2)));
          
          // Préparer les données pour le graphique d'évolution
          const sortedExams = [...gradedExams].sort((a, b) => 
            new Date(a.endedAt || '').getTime() - new Date(b.endedAt || '').getTime()
          );
          
          setScoreProgress(sortedExams.map(exam => ({
            date: new Date(exam.endedAt || '').toLocaleDateString(),
            score: exam.score || 0
          })));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);
  

  if (loading) {
    return <LoadingScreen message="Chargement des données..." />;
  }
  
  // Calculer la tendance par rapport au dernier examen
  const calculateTrend = () => {
    if (scoreProgress.length < 2) return null;
    const lastScore = scoreProgress[scoreProgress.length - 1].score;
    const previousScore = scoreProgress[scoreProgress.length - 2].score;
    return (lastScore - previousScore).toFixed(1);
  };
  
  const trend = calculateTrend();
  
  return (
    <div className="space-y-6">
      {/* Cartes de statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <Medal className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore ? `${averageScore}/20` : 'N/A'}</div>
            {trend && (
              <p className={`text-xs ${parseFloat(trend) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(trend) >= 0 ? '+' : ''}{trend} depuis le dernier examen
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Suivies</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.reduce((classes, exam) => {
                if (!classes.includes(exam.exam.subject)) {
                  classes.push(exam.exam.subject);
                }
                return classes;
              }, [] as string[]).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Classes ce semestre
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Examens à Venir</CardTitle>
            <FileText className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingExams.length}</div>
            <p className="text-xs text-muted-foreground">
              À compléter
            </p>
            {upcomingExams.length > 0 && (
              <Button 
                variant="link" 
                className="px-0 text-xs text-blue-600" 
                onClick={() => router.push('/dashboard/my-exams')}
              >
                Voir tous <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochain Examen</CardTitle>
            <Clock className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            {upcomingExams.length > 0 ? (
              <>
                <div className="text-sm font-bold truncate">{upcomingExams[0].exam.title}</div>
                <p className="text-xs text-muted-foreground">
                  Date limite: {new Date(upcomingExams[0].exam.endDate).toLocaleDateString()}
                </p>
              </>
            ) : (
              <>
                <div className="text-sm font-bold">Aucun examen à venir</div>
                <p className="text-xs text-muted-foreground">Vous êtes à jour!</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour les différentes sections */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="upcoming">Examens à venir</TabsTrigger>
          <TabsTrigger value="recent">Résultats récents</TabsTrigger>
        </TabsList>
        
        {/* Onglet Performance */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            {/* Graphique d'évolution */}
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Évolution des notes</CardTitle>
                <CardDescription>Progression de vos résultats au fil du temps</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {scoreProgress.length > 1 ? (
                  <LineChart 
                    data={scoreProgress.map(item => ({
                      name: item.date,
                      value: item.score
                    }))}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Pas assez de données pour afficher un graphique
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Statistiques par matière */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Performance par matière</CardTitle>
                <CardDescription>Vos moyennes par matière</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] pr-4">
                  {Object.entries(results.reduce((subjects, exam) => {
                    const subject = exam.exam.subject;
                    if (!subjects[subject]) {
                      subjects[subject] = {
                        total: 0,
                        count: 0,
                        exams: []
                      };
                    }
                    if (exam.score !== null) {
                      subjects[subject].total += exam.score;
                      subjects[subject].count += 1;
                      subjects[subject].exams.push(exam);
                    }
                    return subjects;
                  }, {} as Record<string, {total: number, count: number, exams: StudentExam[]}>))
                  
                  // Convertir en tableau et trier par moyenne
                  .sort(([, a], [, b]) => 
                    (b.total / b.count) - (a.total / a.count)
                  )
                  
                  // Mapper pour l'affichage
                  .map(([subject, data]) => {
                    const average = data.count > 0 ? data.total / data.count : 0;
                    return (
                      <div key={subject} className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{subject}</span>
                          <span className="text-sm">{average.toFixed(2)}/20</span>
                        </div>
                        <Progress value={average * 5} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {data.count} examen{data.count > 1 ? 's' : ''} noté{data.count > 1 ? 's' : ''}
                        </p>
                      </div>
                    );
                  })}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Onglet Examens à venir */}
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Examens à compléter</CardTitle>
              <CardDescription>Examens en attente de soumission</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingExams.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="mx-auto h-12 w-12 mb-3 text-green-500" />
                  <p>Vous n'avez aucun examen en attente. Tout est à jour!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingExams.map(exam => {
                    const endDate = new Date(exam.exam.endDate);
                    const now = new Date();
                    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysLeft <= 2;
                    
                    return (
                      <Card key={exam.id} className="overflow-hidden border-l-4 hover:shadow-md transition-shadow"
                        style={{ borderLeftColor: isUrgent ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)' }}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{exam.exam.title}</h3>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                <span>{exam.exam.subject}</span>
                                <span className="mx-1">•</span>
                                <Calendar className="h-3 w-3" />
                                <span>Date limite: {endDate.toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isUrgent && (
                                <Badge variant="destructive" className="mr-2">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Urgent
                                </Badge>
                              )}
                              <Button 
                                size="sm" 
                                onClick={() => router.push(`/dashboard/my-exams/${exam.exam.id}/submit`)}
                              >
                                Compléter
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Résultats récents */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Résultats récents</CardTitle>
              <CardDescription>Vos 5 derniers examens notés</CardDescription>
            </CardHeader>
            <CardContent>
              {results.filter(r => r.score !== null).length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <BarChart3 className="mx-auto h-12 w-12 mb-3 text-blue-500" />
                  <p>Vous n'avez pas encore d'examens notés.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results
                    .filter(r => r.score !== null)
                    .sort((a, b) => new Date(b.endedAt || '').getTime() - new Date(a.endedAt || '').getTime())
                    .slice(0, 5)
                    .map(result => {
                      const score = result.score || 0;
                      const scoreColor = score >= 14 ? 'text-green-600' : 
                                        score >= 10 ? 'text-blue-600' : 'text-red-600';
                      
                      return (
                        <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">{result.exam.title}</h3>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  <span>{result.exam.subject}</span>
                                  <span className="mx-1">•</span>
                                  <Calendar className="h-3 w-3" />
                                  <span>Soumis le: {new Date(result.endedAt || '').toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`text-lg font-bold ${scoreColor}`}>
                                  {score}/20
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => router.push(`/dashboard/my-exams/${result.examId}`)}
                                >
                                  Détails
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    
                    {results.filter(r => r.score !== null).length > 5 && (
                      <div className="text-center">
                        <Button 
                          variant="link" 
                          onClick={() => router.push('/dashboard/results')}
                        >
                          Voir tous les résultats
                        </Button>
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 