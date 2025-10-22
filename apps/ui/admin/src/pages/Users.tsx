import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { applicationService } from '../services/applicationService';
import { User, CreateUserInput, Application } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState<CreateUserInput>({
    username: '',
    password: '',
    role: 'user',
    apps: [],
  });

  const isAdmin = currentUser?.role === 'admin';

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchApplications();
    }
  }, [isAdmin]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      alert('Username and password are required');
      return;
    }

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    setIsCreating(true);
    try {
      await userService.createUser(formData);
      setFormData({
        username: '',
        password: '',
        role: 'user',
        apps: [],
      });
      setShowCreateModal(false);
      fetchUsers();
    } catch (err: any) {
      console.error('Failed to create user:', err);
      alert(err.response?.data?.error || 'Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleAppAssignment = (appId: string) => {
    setFormData((prev) => ({
      ...prev,
      apps: prev.apps?.includes(appId)
        ? prev.apps.filter((id) => id !== appId)
        : [...(prev.apps || []), appId],
    }));
  };

  if (!isAdmin) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <i className="fas fa-ban text-red-500 text-5xl mb-4"></i>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to view this page.</p>
        <p className="text-sm text-gray-500 mt-2">Required role: admin</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600 mt-1">Manage users and their permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <i className="fas fa-user-plus mr-2"></i>
          New User
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <i className="fas fa-users text-gray-400 text-5xl mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Yet</h3>
          <p className="text-gray-600 mb-4">Create your first user to get started.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create User
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-blue-600"></i>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.apps.length === 0 ? (
                        <span className="text-gray-400 italic">No apps assigned</span>
                      ) : (
                        <span className="text-gray-700">{user.apps.length} app(s)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Create New User</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                  required
                  disabled={isCreating}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  disabled={isCreating}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">
                  Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isCreating}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {applications.length > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Assign Applications
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`app-${app.id}`}
                          checked={formData.apps?.includes(app.id)}
                          onChange={() => toggleAppAssignment(app.id)}
                          className="mr-2"
                          disabled={isCreating}
                        />
                        <label htmlFor={`app-${app.id}`} className="text-sm text-gray-700">
                          {app.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  {isCreating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
