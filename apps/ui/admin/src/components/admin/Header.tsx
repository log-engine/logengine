import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ toggleSidebar, sidebarOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-blue-600 focus:outline-none mr-4"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <i className={`fas ${sidebarOpen ? 'fa-bars' : 'fa-bars'}`}></i>
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="text-gray-500 hover:text-blue-600 focus:outline-none">
            <i className="fas fa-bell"></i>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        <div className="relative group">
          <button className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=0D8ABC&color=fff`}
              alt="User"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span>{user?.username}</span>
            <i className="fas fa-chevron-down ml-2 text-xs"></i>
          </button>

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
            <div className="px-4 py-2 border-b">
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm font-semibold text-gray-700 capitalize">{user?.role}</p>
            </div>
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <i className="fas fa-user mr-2"></i> Profile
            </Link>
            <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <i className="fas fa-cog mr-2"></i> Settings
            </Link>
            <div className="border-t my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
