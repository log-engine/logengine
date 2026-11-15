import { useState, useEffect } from 'react';
import { logService } from '../services/logService';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { LogLevel } from '../types';

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  debug: 'bg-muted text-muted-foreground',
  info: 'bg-primary/10 text-primary',
  warn: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  error: 'bg-destructive/10 text-destructive',
  fatal: 'bg-destructive text-destructive-foreground',
};

export function Dashboard() {
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecentLogs = async () => {
    try {
      setIsLoading(true);
      const logsResponse = await logService.getLogs({ page: 1, limit: 10 });
      setRecentLogs(logsResponse.data);
    } catch (err) {
      console.error('Failed to fetch recent logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.username}</h1>
        <p className="text-muted-foreground mt-2">View and explore your application logs</p>
      </div>

      {/* CTA to Log Explorer */}
      <Link to="/logs">
        <div className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Explore Logs
              </h2>
              <p className="text-muted-foreground">
                Search, filter and analyze your application logs
              </p>
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      {/* Recent Logs */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recent Logs</h2>
          <Link
            to="/logs"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
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
            <h3 className="text-lg font-semibold mb-2">No logs yet</h3>
            <p className="text-muted-foreground">Logs from your applications will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="border-b border-border pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      LOG_LEVEL_COLORS[log.level as LogLevel]
                    }`}
                  >
                    {log.level.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono break-all">{log.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(log.ts), 'MMM d, yyyy HH:mm:ss')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

