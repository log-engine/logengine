import { useState, useEffect } from 'react';
import { logService } from '../services/logService';
import { userService } from '../services/userService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApps: 0,
    totalLogs: 0,
    logsToday: 0,
    logsByLevel: {} as Record<string, number>,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const fetchStats = async () => {
    try {
      setIsLoading(true);

      // Fetch log stats
      const logStats = await logService.getLogStats();

      // Fetch users count (admin only)
      let usersCount = 0;
      if (isAdmin) {
        try {
          const users = await userService.getUsers();
          usersCount = users.length;
        } catch (err) {
          console.error('Failed to fetch users:', err);
        }
      }

      // Fetch applications count
      const apps = await applicationService.getApplications();

      // Fetch recent logs
      const logsResponse = await logService.getLogs({ page: 1, limit: 5 });

      setStats({
        totalUsers: usersCount,
        totalApps: apps.length,
        totalLogs: logStats.totalLogs,
        logsToday: logStats.logsToday,
        logsByLevel: logStats.logsByLevel,
      });

      setRecentLogs(logsResponse.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const errorLogs = stats.logsByLevel['error'] || 0;
  const fatalLogs = stats.logsByLevel['fatal'] || 0;
  const totalErrorLogs = errorLogs + fatalLogs;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.username}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isAdmin && (
          <Link to="/users" className="block">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-users text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>
          </Link>
        )}

        <Link to="/applications" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalApps}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-cube text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Logs Today</p>
              <p className="text-3xl font-bold text-green-600">{stats.logsToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-file-alt text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <Link to="/logs?level=error" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Logs</p>
                <p className="text-3xl font-bold text-red-600">{totalErrorLogs}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logs by Level */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Logs by Level</h2>
          {Object.keys(stats.logsByLevel).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No logs available</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.logsByLevel).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded mr-3 ${
                        level === 'error' || level === 'fatal'
                          ? 'bg-red-100 text-red-800'
                          : level === 'warn'
                          ? 'bg-yellow-100 text-yellow-800'
                          : level === 'info'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {level.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${
                          level === 'error' || level === 'fatal'
                            ? 'bg-red-600'
                            : level === 'warn'
                            ? 'bg-yellow-600'
                            : level === 'info'
                            ? 'bg-blue-600'
                            : 'bg-gray-600'
                        }`}
                        style={{
                          width: `${(count / stats.totalLogs) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-700 w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Logs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Logs</h2>
            <Link to="/logs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent logs</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded ${
                            log.level === 'error' || log.level === 'fatal'
                              ? 'bg-red-100 text-red-800'
                              : log.level === 'warn'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 truncate">{log.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(log.ts).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

