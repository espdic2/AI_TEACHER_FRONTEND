export type ExamFormat = 'TXT' | 'MD' | 'TEX' | 'PDF';
export type ExamStatus = 'DRAFT' | 'PUBLISHED';

export interface Question {
  id: string;
  points: number;
  order: number;
}

export enum DatabaseExamType {
  SQL = 'SQL',
  DATABASE = 'DATABASE',
  ALGORITHM = 'ALGORITHM',
  PROGRAMMING = 'PROGRAMMING'
}

export type ExamSubject = 
  | 'SQL'
  | 'DATABASE'
  | 'ALGORITHM'
  | 'PROGRAMMING';

export interface Exam {
  id: string;
  title: string;
  description?: string;
  subject: ExamSubject;
  format: ExamFormat;
  status: ExamStatus;
  questions: Question[];
  referencedSolution?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // ID du professeur
  classId: string; // Add this field
  fileUrl?: string; // URL du fichier si format PDF ou autre
  totalPoints?: number; // Calculé à partir des questions
  endDate?: string; // Date de fin de l'examen
  // Nouveaux champs spécifiques aux examens de BDD
  databaseEngine?: string; // ex: 'mysql', 'postgresql', 'mongodb'
  schemaUrl?: string; // URL vers le schéma de la BDD si nécessaire
  testData?: string; // Données de test pour l'examen
} 