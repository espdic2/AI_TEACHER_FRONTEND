import { Exam } from "@/types/exam";
import { StudentExam } from "@/types/studentExams";
import { API_URL } from "@/config/constants";
import { supabase } from "@/lib/supabase";

interface ProfessorStats {
  totalStudents: number;
  totalClasses: number;
  examsPendingGrading: number;
  averageScore: number;
  examStats: {
    completed: number;
    inProgress: number;
    pending: number;
  };
  classPerformance: Array<{
    id: string;
    name: string;
    average: number;
    studentCount: number;
  }>;
  upcomingExams: Array<{
    id: string;
    title: string;
    subject: string;
    date: string;
    isUrgent: boolean;
  }>;
}

export const examService = {
  async createExam(examData: Partial<Exam>): Promise<Exam> {
    try {
      if (!examData.classId) {
        throw new Error('ClassId is required');
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/exams`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création de l\'examen');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  },

  async getExams(): Promise<Exam[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/exams`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exams');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  },

  async getProfessorExams(): Promise<Exam[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/exams/professor/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch professor exams');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching professor exams:', error);
      throw error;
    }
  },

  async getExamById(id: string): Promise<Exam> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/exams/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exam');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching exam:', error);
      throw error;
    }
  },

  async submitExamAnswer(examId: string, answerData: { fileUrl: string }): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/student/exams/${examId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answerData),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la soumission de la réponse');
      }
    } catch (error) {
      console.error('Error submitting exam answer:', error);
      throw error;
    }
  },

  async updateExam(examData: Partial<Exam>): Promise<Exam> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/exams/${examData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour de l\'examen');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  },

  async uploadFile(file: File, examId?: string): Promise<string> {
    try {
      // Validate file type
      const allowedTypes = {
        'PDF': ['application/pdf'],
        'TEX': ['application/x-tex', 'text/x-tex'],
        'MD': ['text/markdown', 'text/x-markdown'],
        'TXT': ['text/plain']
      };

      const fileExtension = file.name.split('.').pop()?.toUpperCase();
      const fileType = file.type;

      if (!fileExtension || !allowedTypes[fileExtension as keyof typeof allowedTypes] || !allowedTypes[fileExtension as keyof typeof allowedTypes].includes(fileType)) {
        throw new Error('Format de fichier non supporté');
      }

      // Generate a unique file name with proper path
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const uniqueFileName = `${Date.now()}_${sanitizedFileName}`;


      console.log(supabase);
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('sgbd-store')
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(error.message || 'Erreur lors de l\'upload du fichier');
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('sgbd-store')
        .getPublicUrl(uniqueFileName);

      // If this is an exam submission, update the backend with the file URL
      if (examId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/student/exams/${examId}/submit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileUrl: urlData.publicUrl }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la soumission de l\'examen');
        }
      }

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async deleteExam(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/exams/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw error;
    }
  },

  async getStudentExams(): Promise<StudentExam[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/exams/student/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student exams');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching student exams:', error);
      throw error;
    }
  },

  // done only by Student
  async getStudentExamById(examId: string): Promise<StudentExam> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/student/exams/${examId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch student exam');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching student exam:', error);
      throw error;
    }
  },

  
// done by professor or admin
  async getStudentAnswerById(examId: string, studentId: string): Promise<StudentExam> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/professor/exams/${examId}/students/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch student exam answer');
    }
  
    return response.json();
  },

  // Ajouter ces méthodes à l'objet examService existant
  async getExamWithSubmissions(examId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/exams/${examId}/submissions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch exam submissions');
    }
    
    return response.json();
  },

  async autoCorrectExam(examId: string, studentId: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/professor/exams/${examId}/students/${studentId}/auto-correct`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to auto-correct exam');
      }

      return response.json();
    } catch (error) {
      console.error('Error auto-correcting exam:', error);
      throw error;
    }
  },

  async generateReferenceSolution(examId: string): Promise<string> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/professor/exams/${examId}/generate-solution`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate reference solution');
      }

      const data = await response.json();
      return data.referencedSolution;
    } catch (error) {
      console.error('Error generating reference solution:', error);
      throw error;
    }
  },

  async updateReferenceSolution(examId: string, referencedSolution: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/professor/exams/${examId}/reference-solution`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referencedSolution })
      });

      if (!response.ok) {
        throw new Error('Failed to update reference solution');
      }
    } catch (error) {
      console.error('Error updating reference solution:', error);
      throw error;
    }
  },

  // allow professor or admin to grade a student's exam manually
  async gradeExam(examId: string, studentId: string, numericScore: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/professor/exams/${examId}/grade/${studentId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score: numericScore }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to grade exam');
    }
  
    return response.json();
  },

  async getStudentResults(userId: string): Promise<StudentExam[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/student/exams/${userId}/results`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student results');
      }

      console.log(response);
      

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching student results:', error);
      throw error;
    }
  },

  async getProfessorStats(): Promise<ProfessorStats> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/classes/professor/stats/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch professor dashboard stats');
      }

      const data = await response.json();

      // Ensure all required properties exist with default values
      const processedData: ProfessorStats = {
        totalStudents: data.totalStudents || 0,
        totalClasses: data.totalClasses || 0,
        examsPendingGrading: data.examsPendingGrading || 0,
        averageScore: data.averageScore || 0,
        examStats: {
          completed: data.examStats?.completed || 0,
          inProgress: data.examStats?.inProgress || 0,
          pending: data.examStats?.pending || 0
        },
        classPerformance: data.classPerformance || [],
        upcomingExams: []
      };

      // Process upcoming exams if they exist
      if (Array.isArray(data.upcomingExams)) {
        const now = new Date();
        processedData.upcomingExams = data.upcomingExams.map((exam: any) => ({
          id: exam.id,
          title: exam.title,
          subject: exam.subject,
          date: exam.date,
          isUrgent: new Date(exam.date).getTime() - now.getTime() <= 2 * 24 * 60 * 60 * 1000 // 2 days
        }));
      }

      return processedData;
    } catch (error) {
      console.error('Error fetching professor stats:', error);
      throw error;
    }
  },
}; 