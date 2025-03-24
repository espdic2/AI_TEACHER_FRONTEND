export interface StudentGrade {
  examId: string;
  examTitle: string;
  score: number;
  date: string;
}

export interface ClassStudent {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  studentExams: {
    score: number | null;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'GRADED';
    exam: {
      id: string;
      title: string;
      totalPoints: number;
    };
  }[];
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  professor: {
    id: string;
    name: string;
    email: string;
  };
  students: ClassStudent[];
  exams: {
    id: string;
    title: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    totalPoints: number;
  }[];
}

export interface ClassSummary {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  studentCount: number;
  examCount: number;
} 