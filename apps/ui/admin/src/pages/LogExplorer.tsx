import React, { useState, useEffect } from 'react';
import { logService } from '../services/logService';
import { applicationService } from '../services/applicationService';
import { Log, LogFilters, LogLevel, Application } from '../types';
import { format } from 'date-fns';

const LOG_LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  debug: 'bg-gray-100 text-gray-800',
  info: 'bg-blue-100 text-blue-800',
  warn: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  fatal: 'bg-purple-100 text-purple-800',
};

export function LogExplorer() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<LogFilters>({
    page: 1,
    limit: 50,
  });

  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const response = await logService.getLogs(filters);
      setLogs(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch logs:', err);
      setError('Failed to load logs');
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const handleFilterChange = (key: keyof LogFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // Reset to page 1 when changing other filters
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 50,
    });
  };

  const getAppName = (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    return app?.name || appId.substring(0, 8);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Log Explorer</h1>
        <p className="text-gray-600 mt-1">Search and filter application logs</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Application Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application</label>
            <select
              value={filters.appId || ''}
              onChange={(e) => handleFilterChange('appId', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Applications</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={filters.level || ''}
              onChange={(e) => handleFilterChange('level', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              {LOG_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="datetime-local"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="datetime-local"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Message</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
              placeholder="Search in log messages..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <i className="fas fa-redo mr-2"></i>
              Clear
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {logs.length} of {total} log(s)
          </span>
          <span>Page {filters.page} of {totalPages}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Logs List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading logs...</p>
          </div>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <i className="fas fa-file-alt text-gray-400 text-5xl mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Logs Found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          LOG_LEVEL_COLORS[log.level as LogLevel]
                        }`}
                      >
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{getAppName(log.appId)}</span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(log.ts), 'yyyy-MM-dd HH:mm:ss')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 font-mono">{log.message}</p>
                  </div>
                  <i
                    className={`fas fa-chevron-${expandedLog === log.id ? 'up' : 'down'} text-gray-400 ml-4`}
                  ></i>
                </div>
              </div>

              {expandedLog === log.id && (
                <div className="px-4 pb-4 border-t border-gray-200 pt-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">ID:</span>
                      <p className="text-gray-600 font-mono">{log.id}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">PID:</span>
                      <p className="text-gray-600 font-mono">{log.pid || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Hostname:</span>
                      <p className="text-gray-600 font-mono">{log.hostname || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Created:</span>
                      <p className="text-gray-600">{format(new Date(log.createdAt), 'PPpp')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => handleFilterChange('page', Math.max(1, (filters.page || 1) - 1))}
            disabled={filters.page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if ((filters.page || 1) <= 3) {
              pageNum = i + 1;
            } else if ((filters.page || 1) >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = (filters.page || 1) - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handleFilterChange('page', pageNum)}
                className={`px-4 py-2 border rounded-lg ${
                  filters.page === pageNum
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handleFilterChange('page', Math.min(totalPages, (filters.page || 1) + 1))}
            disabled={filters.page === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}
