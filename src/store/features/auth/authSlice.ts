import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isTokenExpired, storeAuthData, clearAuthData } from '@/utils/token';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

const initialState: AuthState = {
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data: LoginResponse = await response.json();
    
    // Store auth data
    storeAuthData(data.accessToken, data.user);
    
    return {
      user: data.user,
      token: data.accessToken,
    };
  }
);

export const checkAuthState = createAsyncThunk(
  'auth/checkState',
  async (_, { dispatch }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found during auth check');
      return null;
    }
    
    if (isTokenExpired(token)) {
      console.log('Token expired, logging out');
      dispatch(logout());
      return null;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return { user, token };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      clearAuthData();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;