import { User } from "./user";
import { Exam } from "./exam";

export enum StudentExamStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  GRADED = "GRADED"
}

export interface StudentExam {
  id: string;
  startedAt: Date;
  endedAt?: Date | null;
  status: StudentExamStatus;
  score?: number | null;
  feedback?: string | null;
  fileUrl?: string | null;
  
  // Relations
  student: User;
  studentId: string;
  exam: Exam;
  examId: string;
}