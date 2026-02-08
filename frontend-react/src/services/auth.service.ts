import api from './api';
import { AuthResponse, LoginDto, RegisterDto, UserProfile } from '../types/auth.types';

export const authService = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/auth/profile');
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
