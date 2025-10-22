import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { Application, CreateApplicationInput } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const data = await applicationService.getApplications();
      setApplications(data);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    setIsCreating(true);
    try {
      const input: CreateApplicationInput = { name: newAppName };
      await applicationService.createApplication(input);
      setNewAppName('');
      setShowCreateModal(false);
      fetchApplications();
    } catch (err: any) {
      console.error('Failed to create application:', err);
      alert('Failed to create application');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Applications</h1>
          <p className="text-gray-600 mt-1">Manage your applications and API keys</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            New Application
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <i className="fas fa-cube text-gray-400 text-5xl mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-4">
            {isAdmin ? 'Create your first application to get started.' : 'No applications have been assigned to you.'}
          </p>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Application
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-cube text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{app.name}</h3>
                    <p className="text-xs text-gray-500">ID: {app.id.substring(0, 8)}...</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2">API Key</label>
                <div className="flex items-center bg-gray-50 p-3 rounded border border-gray-200">
                  <code className="flex-1 text-sm font-mono text-gray-700 truncate">{app.key}</code>
                  <button
                    onClick={() => copyToClipboard(app.key)}
                    className="ml-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    <i className={`fas ${copiedKey === app.key ? 'fa-check text-green-600' : 'fa-copy'}`}></i>
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  <i className="fas fa-calendar mr-2"></i>
                  Created: {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Application Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Create New Application</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleCreateApp}>
              <div className="mb-4">
                <label htmlFor="appName" className="block text-gray-700 font-semibold mb-2">
                  Application Name
                </label>
                <input
                  type="text"
                  id="appName"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., My Web App"
                  required
                  disabled={isCreating}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
