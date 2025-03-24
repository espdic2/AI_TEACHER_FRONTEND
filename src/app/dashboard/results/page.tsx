"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { examService } from "@/services/examService";
import { StudentExam } from "@/types/studentExams";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
  Award, BookOpen, Calendar, BarChart3, Search, Filter, 
  FileCheck, Eye, Download, TrendingUp, PieChart, CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LineChart } from "@/components/ui/charts";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function ResultsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [results, setResults] = useState<StudentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!user?.id) return;
        const data = await examService.getStudentResults(user.id);
        setResults(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des résultats");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user?.id]);

  // Calculer la moyenne générale
  const calculateAverageScore = () => {
    const gradedExams = results.filter(exam => exam.score !== null);
    if (gradedExams.length === 0) return null;
    const sum = gradedExams.reduce((acc, exam) => acc + (exam.score || 0), 0);
    return (sum / gradedExams.length).toFixed(2);
  };

  // Filtrer les résultats
  const filteredResults = results.filter(result => {
    const matchesSearch = result.exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          result.exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === "all" || result.exam.subject === subjectFilter;
    
    // Filtrage par période
    if (selectedPeriod === "all") return matchesSearch && matchesSubject;
    
    if (!result.endedAt) return false;
    
    const resultDate = new Date(result.endedAt);
    const now = new Date();
    
    if (selectedPeriod === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      return resultDate >= lastMonth && matchesSearch && matchesSubject;
    }
    
    if (selectedPeriod === "semester") {
      const lastSemester = new Date();
      lastSemester.setMonth(now.getMonth() - 6);
      return resultDate >= lastSemester && matchesSearch && matchesSubject;
    }
    
    if (selectedPeriod === "year") {
      const lastYear = new Date();
      lastYear.setFullYear(now.getFullYear() - 1);
      return resultDate >= lastYear && matchesSearch && matchesSubject;
    }
    
    return matchesSearch && matchesSubject;
  });

  // Obtenir la liste unique des matières
  const subjects = [...new Set(results.map(result => result.exam.subject))];

  // Préparer les données pour le graphique d'évolution
  const scoreProgress = results
    .filter(exam => exam.score !== null && exam.endedAt)
    .sort((a, b) => new Date(a.endedAt || '').getTime() - new Date(b.endedAt || '').getTime())
    .map(exam => ({
      date: new Date(exam.endedAt || '').toLocaleDateString(),
      score: exam.score || 0
    }));

  // Calculer la tendance
  const calculateTrend = () => {
    if (scoreProgress.length < 2) return null;
    const lastScore = scoreProgress[scoreProgress.length - 1].score;
    const previousScore = scoreProgress[scoreProgress.length - 2].score;
    return (lastScore - previousScore).toFixed(1);
  };

  const trend = calculateTrend();

  // Distribution des notes
  const scoreDistribution = {
    excellent: results.filter(exam => exam.score !== null && exam.score >= 16).length,
    good: results.filter(exam => exam.score !== null && exam.score >= 14 && exam.score < 16).length,
    average: results.filter(exam => exam.score !== null && exam.score >= 10 && exam.score < 14).length,
    poor: results.filter(exam => exam.score !== null && exam.score < 10).length,
  };

  // Trouver la meilleure matière
  const subjectPerformance = Object.entries(results.reduce((subjects, exam) => {
    const subject = exam.exam.subject;
    if (!subjects[subject]) {
      subjects[subject] = {
        total: 0,
        count: 0,
      };
    }
    if (exam.score !== null) {
      subjects[subject].total += exam.score;
      subjects[subject].count += 1;
    }
    return subjects;
  }, {} as Record<string, {total: number, count: number}>))
  .filter(([, data]) => data.count > 0)
  .map(([subject, data]) => ({
    subject,
    average: data.total / data.count
  }));

  const bestSubject = subjectPerformance.length > 0 
    ? subjectPerformance.reduce((best, current) => 
        current.average > best.average ? current : best, subjectPerformance[0])
    : null;

    if (loading) {
      return <LoadingScreen message="Chargement des résultats..." />;
    }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background sticky top-0 z-10 border-b">
        <div className="container flex h-16 items-center px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-4 h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Résultats</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Mes Résultats</h1>
        </div>

        {/* Aperçu des statistiques */}
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600" />
              Résumé des performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Moyenne générale</div>
                    <div className="text-xl font-bold">{calculateAverageScore() ? `${calculateAverageScore()}/20` : 'N/A'}</div>
                  </div>
                </div>
                <Progress 
                  value={calculateAverageScore() ? parseFloat(calculateAverageScore() || "0") * 5 : 0} 
                  className="h-1.5" 
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <FileCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Examens complétés</div>
                    <div className="text-xl font-bold">{results.filter(exam => exam.endedAt).length}/{results.length}</div>
                  </div>
                </div>
                <Progress 
                  value={(results.filter(exam => exam.endedAt).length / results.length) * 100} 
                  className="h-1.5 bg-green-600" 
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Matières</div>
                    <div className="text-xl font-bold">{subjects.length}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {subjects.slice(0, 3).join(", ")}
                  {subjects.length > 3 && ` et ${subjects.length - 3} autre${subjects.length - 3 > 1 ? 's' : ''}`}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Meilleure note</div>
                    <div className="text-xl font-bold">
                      {results.filter(exam => exam.score !== null).length > 0 
                        ? `${Math.max(...results.filter(exam => exam.score !== null).map(exam => exam.score || 0))}/20`
                        : 'N/A'
                      }
                    </div>
                  </div>
                </div>
                {bestSubject && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Meilleure matière: <span className="font-medium text-green-600">{bestSubject.subject}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtres et période */}
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un examen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
                <div className="w-full md:w-64 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select 
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">Toutes les matières</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-64 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">Toutes les périodes</option>
                    <option value="month">Dernier mois</option>
                    <option value="semester">Dernier semestre</option>
                    <option value="year">Dernière année</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Colonne de gauche - Statistiques */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Performance globale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Moyenne générale</span>
                      <span className="font-medium">{calculateAverageScore() ? `${calculateAverageScore()}/20` : 'N/A'}</span>
                    </div>
                    <Progress 
                      value={calculateAverageScore() ? parseFloat(calculateAverageScore() || "0") * 5 : 0} 
                      className="h-2" 
                    />
                    {trend && (
                      <p className={`text-xs mt-1 ${parseFloat(trend) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="flex items-center gap-1">
                          {parseFloat(trend) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 transform rotate-180" />}
                          {parseFloat(trend) >= 0 ? '+' : ''}{trend} depuis le dernier examen
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <PieChart className="h-4 w-4 text-indigo-600" />
                      Distribution des notes
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded p-2 text-center">
                        <div className="text-green-600 font-bold">{scoreDistribution.excellent}</div>
                        <div className="text-xs text-green-800 dark:text-green-400">Excellent (16-20)</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 text-center">
                        <div className="text-blue-600 font-bold">{scoreDistribution.good}</div>
                        <div className="text-xs text-blue-800 dark:text-blue-400">Bien (14-16)</div>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-2 text-center">
                        <div className="text-yellow-600 font-bold">{scoreDistribution.average}</div>
                        <div className="text-xs text-yellow-800 dark:text-yellow-400">Moyen (10-14)</div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 rounded p-2 text-center">
                        <div className="text-red-600 font-bold">{scoreDistribution.poor}</div>
                        <div className="text-xs text-red-800 dark:text-red-400">Insuffisant (0-10)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Performance par matière
                </CardTitle>
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
                          <span className={`text-sm ${
                            average >= 14 ? "text-green-600" : 
                            average >= 10 ? "text-blue-600" : "text-red-600"
                          }`}>
                            {average.toFixed(2)}/20
                          </span>
                        </div>
                        <Progress 
                          value={average * 5} 
                          className={`h-2 ${
                            average >= 14 ? "bg-green-600" : 
                            average >= 10 ? "bg-blue-600" : "bg-red-600"
                          }`} 
                        />
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

          {/* Colonne centrale et droite - Graphique et liste des examens */}
          <div className="md:col-span-2 space-y-6">
            {/*<Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Évolution des notes
                </CardTitle>
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
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-12 w-12 mb-3 text-blue-500/30" />
                      <p>Pas assez de données pour afficher un graphique</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complétez plus d'examens pour voir votre progression
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>*/}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-indigo-600" />
                  Détail des examens
                </CardTitle>
                <CardDescription>
                  {filteredResults.length} examen{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredResults.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <BarChart3 className="mx-auto h-12 w-12 mb-3 text-blue-500/30" />
                    <p>Aucun résultat ne correspond à vos critères de recherche.</p>
                    {(searchTerm || subjectFilter !== "all" || selectedPeriod !== "all") && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm("");
                          setSubjectFilter("all");
                          setSelectedPeriod("all");
                        }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredResults
                      .sort((a, b) => new Date(b.endedAt || '').getTime() - new Date(a.endedAt || '').getTime())
                      .map((result) => (
                        <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
                              <div className="mb-4 md:mb-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{result.exam.title}</h3>
                                  {result.score !== null && (
                                    <Badge className={
                                      result.score >= 16 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : 
                                      result.score >= 14 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
                                      result.score >= 10 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    }>
                                      {result.score}/20
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    <span>{result.exam.subject}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>
                                      {result.endedAt ? new Date(result.endedAt).toLocaleDateString() : 'Non soumis'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => router.push(`/dashboard/my-exams/${result.examId}`)}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Détails
                                </Button>
                                {result.fileUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => window.open(result.fileUrl, '_blank')}
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    Télécharger
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
              {filteredResults.length > 0 && (
                <CardFooter className="flex justify-between items-center border-t px-6 py-4">
                  <div className="text-sm text-muted-foreground">
                    Affichage de {filteredResults.length} examen{filteredResults.length > 1 ? 's' : ''} sur {results.length}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setSubjectFilter("all");
                      setSelectedPeriod("all");
                    }}
                    disabled={!searchTerm && subjectFilter === "all" && selectedPeriod === "all"}
                  >
                    Réinitialiser les filtres
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>

        {/* Section des examens récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Examens récents
            </CardTitle>
            <CardDescription>
              Vos 5 derniers examens notés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Examen</TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results
                  .filter(exam => exam.score !== null)
                  .sort((a, b) => new Date(b.endedAt || '').getTime() - new Date(a.endedAt || '').getTime())
                  .slice(0, 5)
                  .map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.exam.title}</TableCell>
                      <TableCell>{result.exam.subject}</TableCell>
                      <TableCell>
                        <Badge className={
                          result.score !== null ? (
                            result.score !== undefined && result.score >= 16 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : 
                            result.score !== undefined && result.score >= 14 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
                            result.score !== undefined && result.score >= 10 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          ) : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }>
                          {result.score !== null ? `${result.score}/20` : 'En attente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {result.endedAt ? new Date(result.endedAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => router.push(`/dashboard/my-exams/${result.examId}`)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {results.filter(exam => exam.score !== null).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Aucun examen noté pour le moment
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}