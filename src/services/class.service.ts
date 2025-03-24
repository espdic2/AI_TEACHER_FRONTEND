import {Class} from '@/types/class';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const classService = {
  async getProfessorClasses(): Promise<Class[]> {
    try {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user || !user.id) {
        throw new Error('User information not found');
      }

      const response = await fetch(`${API_URL}/classes/professor/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  },

  async getClassDetails(classId: string): Promise<Class> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/classes/${classId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch class details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching class details:', error);
      throw error;
    }
  },

  async getProfessorClassesById(professorId: string): Promise<Class[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/professors/${professorId}/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch professor classes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching professor classes:', error);
      throw error;
    }
  },

  async getAllClasses(): Promise<Class[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all classes:', error);
      throw error;
    }
  },

  removeStudentFromClass: async (classId: string, studentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/classes/${classId}/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove student from class');
      }

      return await response.json();
    } catch (error) {
      console.error('Error removing student:', error);
      throw error;
    }
  },

  updateClass: async (classId: string, classData: Partial<Class>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });

      if (!response.ok) {
        throw new Error('Failed to update class');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  },

  deleteClass: async (classId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/classes/${classId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete class');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  },

  async createClass(classData: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    professorId: string;
  }) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/classes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });

      if (!response.ok) {
        throw new Error('Failed to create class');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  },

  async deleteClasses(classIds: string[]): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/classes`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete classes');
      }
    } catch (error) {
      console.error('Error deleting classes:', error);
      throw error;
    }
  },
}; 