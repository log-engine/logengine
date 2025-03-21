import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLayout } from './layouts';
import {Dashboard} from './pages';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="users">
            <Route index element={<div>All Users</div>} />
            <Route path="new" element={<div>Add New User</div>} />
            <Route path="roles" element={<div>Roles & Permissions</div>} />
          </Route>
          
          <Route path="logs">
            <Route index element={<div>Log Explorer</div>} />
            <Route path="alerts" element={<div>Log Alerts</div>} />
            <Route path="reports" element={<div>Log Reports</div>} />
          </Route>
          
          <Route path="settings" element={<div>Settings</div>} />
          <Route path="profile" element={<div>User Profile</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
