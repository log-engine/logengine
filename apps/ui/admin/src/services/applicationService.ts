import { apiClient } from '../lib/axios';
import { Application, CreateApplicationInput } from '../types';

export const applicationService = {
  getApplications: async (q?: string): Promise<Application[]> => {
    const params = q ? { q } : {};
    const response = await apiClient.get<Application[]>('/applications', { params });
    return response.data;
  },

  createApplication: async (appData: CreateApplicationInput): Promise<Application> => {
    const response = await apiClient.post<Application>('/applications', appData);
    return response.data;
  },
};
