import { apiClient } from '../lib/axios';
import { User, CreateUserInput } from '../types';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  createUser: async (userData: CreateUserInput): Promise<User> => {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },
};
