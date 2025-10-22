import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts';
import { Dashboard } from './pages';
import { Login } from './pages/Login';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            <Route path="users">
              <Route index element={<div>All Users</div>} />
              <Route path="new" element={<div>Add New User</div>} />
              <Route path="roles" element={<div>Roles & Permissions</div>} />
            </Route>

            <Route path="applications">
              <Route index element={<div>Applications List</div>} />
            </Route>

            <Route path="logs">
              <Route index element={<div>Log Explorer</div>} />
              <Route path="alerts" element={<div>Log Alerts</div>} />
              <Route path="reports" element={<div>Log Reports</div>} />
            </Route>

            <Route path="settings" element={<div>Settings</div>} />
            <Route path="profile" element={<div>User Profile</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
