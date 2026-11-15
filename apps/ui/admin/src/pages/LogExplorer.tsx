import React, { useState, useEffect } from 'react';
import { logService } from '../services/logService';
import { applicationService } from '../services/applicationService';
import { Log, LogFilters, LogLevel, Application } from '../types';
import { format } from 'date-fns';

const LOG_LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  debug: 'bg-muted text-muted-foreground',
  info: 'bg-primary/10 text-primary',
  warn: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  error: 'bg-destructive/10 text-destructive',
  fatal: 'bg-destructive text-destructive-foreground',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Log Explorer</h1>
        <p className="text-muted-foreground mt-2">Search and filter application logs</p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Application Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Application</label>
            <select
              value={filters.appId || ''}
              onChange={(e) => handleFilterChange('appId', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
            <label className="block text-sm font-medium mb-2">Level</label>
            <select
              value={filters.level || ''}
              onChange={(e) => handleFilterChange('level', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="datetime-local"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="datetime-local"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Search Message</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
              placeholder="Search in log messages..."
              className="flex-1 px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>
            Showing {logs.length} of {total} log(s)
          </span>
          <span>Page {filters.page} of {totalPages}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {/* Logs List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-card border border-border rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading logs...</p>
          </div>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-card border border-border p-12 rounded-lg text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-muted-foreground mb-4"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No Logs Found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          LOG_LEVEL_COLORS[log.level as LogLevel]
                        }`}
                      >
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">{getAppName(log.appId)}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.ts), 'yyyy-MM-dd HH:mm:ss')}
                      </span>
                    </div>
                    <p className="text-sm font-mono break-all">{log.message}</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-muted-foreground transition-transform ${expandedLog === log.id ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {expandedLog === log.id && (
                <div className="px-4 pb-4 border-t border-border pt-4 bg-muted/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">ID:</span>
                      <p className="text-muted-foreground font-mono break-all">{log.id}</p>
                    </div>
                    <div>
                      <span className="font-semibold">PID:</span>
                      <p className="text-muted-foreground font-mono">{log.pid || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Hostname:</span>
                      <p className="text-muted-foreground font-mono">{log.hostname || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Created:</span>
                      <p className="text-muted-foreground">{format(new Date(log.createdAt), 'PPpp')}</p>
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
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleFilterChange('page', Math.max(1, (filters.page || 1) - 1))}
            disabled={filters.page === 1}
            className="px-4 py-2 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
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
                className={`px-4 py-2 border rounded-md font-medium transition-colors ${
                  filters.page === pageNum
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handleFilterChange('page', Math.min(totalPages, (filters.page || 1) + 1))}
            disabled={filters.page === totalPages}
            className="px-4 py-2 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
