import React from 'react';

export function Dashboard () {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Logs Today</h2>
          <p className="text-3xl font-bold text-green-600">567</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Error Logs</h2>
          <p className="text-3xl font-bold text-red-600">89</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Active Projects</h2>
          <p className="text-3xl font-bold text-purple-600">12</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="border-b pb-2 mb-2">
          <p className="text-gray-800">User login from 192.168.1.1</p>
          <p className="text-sm text-gray-500">Today at 10:30 AM</p>
        </div>
        <div className="border-b pb-2 mb-2">
          <p className="text-gray-800">Error logged: Database connection timeout</p>
          <p className="text-sm text-gray-500">Today at 09:15 AM</p>
        </div>
        <div className="border-b pb-2 mb-2">
          <p className="text-gray-800">New user registered: john.doe@example.com</p>
          <p className="text-sm text-gray-500">Yesterday at 05:45 PM</p>
        </div>
      </div>
    </div>
  );
};

