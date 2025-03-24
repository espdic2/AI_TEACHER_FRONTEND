import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart } from "@/components/ui/charts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  GraduationCap,
  FileText,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
  Award,
  Target,
  Search,
  Bell,
  Download,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { CardDescription } from "../ui/card";
import { Progress } from "../ui/progress";
import { MoreHorizontal } from "lucide-react";
import { LineChartIcon } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalUsers: number;
  totalExams: number;
  totalClasses: number;
  recentActivity: {
    type: 'USER_CREATED' | 'EXAM_CREATED' | 'CLASS_CREATED' | 'EXAM_SUBMITTED';
    date: string;
    details: string;
  }[];
  usersByRole: {
    students: number;
    professors: number;
    admins: number;
  };
  examStats: {
    published: number;
    draft: number;
    averageScore: number;
  };
  classStats?: {
    total: number;
    active: number;
  };
  userCreationStats: {
    date: string;
    count: number;
  }[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await userService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const groupUsersByMonth = (stats: DashboardStats) => {
    if (!stats?.userCreationStats) return []

    // Create a Map to group by month
    const monthlyData = new Map()

    // Get current date
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    // Initialize the last 3 months with 0
    for (let i = 2; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1)
      const monthKey = date.toLocaleString("fr-FR", { month: "short", year: "2-digit" })
      monthlyData.set(monthKey, 0)
    }

    // Group data by month
    stats.userCreationStats.forEach((stat) => {
      const date = new Date(stat.date)
      // Only consider the last 3 months
      const monthsAgo = (currentYear - date.getFullYear()) * 12 + currentMonth - date.getMonth()
      if (monthsAgo <= 2 && monthsAgo >= 0) {
        const monthKey = date.toLocaleString("fr-FR", { month: "short", year: "2-digit" })
        monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + stat.count)
      }
    })

    // Convert to array for the chart
    return Array.from(monthlyData.entries()).map(([name, value]) => ({
      name,
      value,
    }))
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "USER_CREATED":
        return <Users className="h-4 w-4 text-blue-500" />
      case "EXAM_CREATED":
        return <FileText className="h-4 w-4 text-violet-500" />
      case "CLASS_CREATED":
        return <GraduationCap className="h-4 w-4 text-amber-500" />
      case "EXAM_SUBMITTED":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Error Loading Dashboard</CardTitle>
            <CardDescription>We couldn't load your dashboard data</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, Admin</h2>
            <p className="text-muted-foreground mt-1">Here's what's happening in your institution today.</p>
          </div>
          {/*<div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Pro Plan Active</span>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>*/}
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
          <Card className="overflow-hidden pt-0 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row py-4 items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{stats.usersByRole.students.toLocaleString()}</div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                <span className="font-medium text-emerald-500">12%</span>
                <span className="ml-1">from last month</span>
              </div>
              <Progress className="mt-4 h-1" value={75} />
            </CardContent>
          </Card>

          <Card className="overflow-hidden pt-0 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row py-4 items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20">
              <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
              <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
                <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{stats.totalClasses}</div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <span>Across {stats.usersByRole.professors} professors</span>
              </div>
              <Progress className="mt-4 h-1" value={60} />
            </CardContent>
          </Card>

          {/*<Card className="overflow-hidden pt-0 transition-all hover:shadow-md">
            <CardHeader
                className="flex flex-row py-4 items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400"/>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{stats.examStats.averageScore.toFixed(1)}/20</div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <span>Based on {stats.totalExams} exams</span>
              </div>
              <Progress className="mt-4 h-1" value={83}/>
            </CardContent>
          </Card>

            <Card className="overflow-hidden pt-0 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row py-4 items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-950/20 dark:to-violet-900/20">
            <CardTitle className="text-sm font-medium">Exams to Grade</CardTitle>
            <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/30">
            <FileText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
            </CardHeader>
            <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.examStats.needsGrading || 0}</div>
        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          <span>Awaiting evaluation</span>
        </div>
        <Progress className="mt-4 h-1" value={35}/>
      </CardContent>
    </Card>
*/}
        </div>

        {/* Analytics & Activity */}
        <div className="grid gap-6 lg:grid-cols-7 mb-8">
          {/* Main Analytics */}
          <Card className="lg:col-span-5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Track key metrics across your institution</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <LineChartIcon className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="students" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Students
                  </TabsTrigger>
                  <TabsTrigger value="exams" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Exams
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="h-[350px] w-full">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium">User Growth (Last 3 Months)</h3>
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                      +24.5%
                    </Badge>
                  </div>
                  <LineChart data={groupUsersByMonth(stats)} />
                </TabsContent>
                <TabsContent value="students" className="h-[350px] w-full">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium">User Distribution by Role</h3>
                    <Badge variant="outline" className="text-xs">
                      {stats.totalUsers} Total Users
                    </Badge>
                  </div>
                  <PieChart
                    data={[
                      { name: "Students", value: stats.usersByRole.students || 0 },
                      { name: "Professors", value: stats.usersByRole.professors || 0 },
                      { name: "Administrators", value: stats.usersByRole.admins || 0 },
                    ]}
                  />
                </TabsContent>
                <TabsContent value="exams" className="h-[350px] w-full">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium">Exam Status Distribution</h3>
                    <Badge variant="outline" className="text-xs">
                      {stats.totalExams} Total Exams
                    </Badge>
                  </div>
                  <BarChart
                    data={[
                      { name: "Published", value: stats.examStats.published || 0 },
                      { name: "Draft", value: stats.examStats.draft || 0 },
                      { name: "Needs Grading", value: stats.examStats.needsGrading || 0 },
                    ]}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your institution</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {stats.recentActivity.map((activity, i) => (
                  <div key={i} className="mb-4 flex items-start gap-3 pb-4 last:mb-0 last:pb-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.details}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(activity.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-medium">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => router.push('/dashboard/users')}
            >
              <Users className="h-5 w-5 text-green-400" />
              <span>Manage Users</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => router.push('/dashboard/exams/create')}
            >
              <FileText className="h-5 w-5 text-yellow-400" />
              <span>Create Exam</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => router.push('/dashboard/classes/create')}
            >
              <GraduationCap className="h-5 w-5 text-blue-400" />
              <span>Add Class</span>
            </Button>
          </div>
        </div>

        {/* Upcoming Events */}
      </main>
    </div>
  )
}
