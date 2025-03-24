import { User } from '@/types/user';
import {Class} from "@/types/class";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async addUsersToClass(classId: string, userIds: string[]): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/classes/${classId}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to add users to class');
      }
    } catch (error) {
      console.error('Error adding users to class:', error);
      throw error;
    }
  },

  async getProfessors(): Promise<User[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/professors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch professors');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching professors:', error);
      throw error;
    }
  },

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'PROFESSOR' | 'STUDENT';
  }): Promise<User> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUserById(userId: string): Promise<User> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async getUserClasses(userId: string): Promise<Class[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userId}/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user classes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user classes:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // student that are not already in the class
  async getStudentsNotInClass(classId: string): Promise<User[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/students/allnotinclass/${classId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  async getDashboardStats(): Promise<{
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
      needsGrading: number;
    };
    classStats: {
      total: number;
      active: number;
    };
  }> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  async updatePassword(userId: string, passwordData: { currentPassword: string; newPassword: string }): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  async deleteUsers(userIds: string[]): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete users');
      }
    } catch (error) {
      console.error('Error deleting users:', error);
      throw error;
    }
  },

  async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset user password');
      }
    } catch (error) {
      console.error('Error resetting user password:', error);
      throw error;
    }
  },
}; 