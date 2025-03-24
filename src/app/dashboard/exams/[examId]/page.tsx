"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { examService } from "@/services/examService"
import { toast } from "sonner"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExamViewer } from "@/components/ui/exam-viewer"
import {
  FileText,
  BookOpen,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  FileCheck,
  Award,
  ArrowLeft,
  Eye,
  PencilLine,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function ViewExamPage() {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const { examId } = useParams()
  const [exam, setExam] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    submittedCount: 0,
    averageScore: 0,
    needsGrading: 0
  })

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await examService.getExamById(examId as string)
        setExam(data)
        // Simulate stats for demo
        setStats({
          totalStudents: 45,
          submittedCount: 38,
          averageScore: 14.5,
          needsGrading: 12
        })
        setLoading(false)
      } catch (error) {
        toast.error("Erreur lors du chargement de l'examen")
        router.push('/dashboard/exams')
      }
    }
    fetchExam()
  }, [examId, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h2 className="text-xl font-semibold">Chargement de l'examen</h2>
          <p className="text-muted-foreground max-w-md">
            Nous récupérons les informations de l'examen, veuillez patienter un instant...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="bg-background sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
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
              <BreadcrumbPage>{exam.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto w-full max-w-7xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold tracking-tight">{exam.title}</h1>
                <Badge variant={exam.status === 'PUBLISHED' ? "success" : "secondary"}>
                  {exam.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{exam.subject}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date limite: {new Date(exam.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {(user?.role === 'PROFESSOR' || user?.role === 'ADMIN') && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push('/dashboard/exams')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <Button variant="outline" onClick={() => router.push(`/dashboard/exams/edit/${examId}`)}>
                  <PencilLine className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => router.push(`/dashboard/exams/${examId}/grade`)}
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  Noter les examens
                </Button>
              </div>
            )}
          </div>


          <Card className="shadow-md hover:shadow-lg transition-all border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Sujet de l'examen
              </CardTitle>
              <CardDescription>
                Consultez le document d'examen ci-dessous
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 h-[600px] overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800/50">
              <ExamViewer fileUrl={exam.fileUrl} format={exam.format} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 