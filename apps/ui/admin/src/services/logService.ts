import { apiClient } from '../lib/axios';
import { Log, LogFilters, PaginatedResponse } from '../types';

export const logService = {
  getLogs: async (filters: LogFilters): Promise<PaginatedResponse<Log>> => {
    const response = await apiClient.get<PaginatedResponse<Log>>('/logs', {
      params: filters,
    });
    return response.data;
  },

  getLogStats: async () => {
    const response = await apiClient.get('/logs/stats');
    return response.data;
  },
};
