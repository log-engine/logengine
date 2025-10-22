import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts';
import { Dashboard } from './pages';
import { Login } from './pages/Login';
import { Applications } from './pages/Applications';
import { Users } from './pages/Users';
import { LogExplorer } from './pages/LogExplorer';

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
              <Route index element={<Users />} />
            </Route>

            <Route path="applications">
              <Route index element={<Applications />} />
            </Route>

            <Route path="logs">
              <Route index element={<LogExplorer />} />
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
