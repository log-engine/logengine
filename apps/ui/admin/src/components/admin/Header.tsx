import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ toggleSidebar, sidebarOpen }: HeaderProps) {
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
              src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" 
              alt="User" 
              className="w-8 h-8 rounded-full mr-2" 
            />
            <span>Admin</span>
            <i className="fas fa-chevron-down ml-2 text-xs"></i>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
            <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <i className="fas fa-user mr-2"></i> Profile
            </Link>
            <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <i className="fas fa-cog mr-2"></i> Settings
            </Link>
            <div className="border-t my-1"></div>
            <Link to="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
