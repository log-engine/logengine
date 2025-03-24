import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  to: string;
  icon: string;
  label: string;
  active?: boolean;
  children?: React.ReactNode;
  isCollapsed?: boolean;
}

export function SidebarItem({ 
  to, 
  icon, 
  label, 
  active, 
  children, 
  isCollapsed = false 
}: SidebarItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = (e: React.MouseEvent) => {
    if (children) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  return (
    <div className="mb-2">
      <Link
        to={children ? '#' : to}
        onClick={toggleExpand}
        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
          active ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 text-gray-700 hover:text-blue-600'
        }`}
      >
        <i className={`${icon} ${isCollapsed ? 'text-lg' : 'mr-3'}`}></i>
        {!isCollapsed && (
          <>
            <span className="flex-1">{label}</span>
            {children && (
              <i className={`fas fa-chevron-${expanded ? 'down' : 'right'} text-xs`}></i>
            )}
          </>
        )}
      </Link>
      
      {children && expanded && !isCollapsed && (
        <div className="ml-8 mt-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

export function SubMenuItem({ 
  to, 
  label, 
  active 
}: { to: string; label: string; active?: boolean }) {
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-sm ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  );
};

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const location = useLocation();
  const path = location.pathname;
  
  return (
    <div 
      className={`h-screen bg-white shadow-md fixed left-0 top-0 overflow-y-auto transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className={`px-6 py-4 border-b flex items-center ${!isOpen && 'justify-center'}`}>
        {isOpen ? (
          <h1 className="text-xl font-bold text-blue-700">LogEngine Admin</h1>
        ) : (
          <span className="text-xl font-bold text-blue-700">LE</span>
        )}
      </div>
      
      <div className="p-4">
        <SidebarItem 
          to="/admin" 
          icon="fas fa-tachometer-alt" 
          label="Dashboard" 
          active={path === '/admin'} 
          isCollapsed={!isOpen}
        />
        
        <SidebarItem 
          to="/admin/users" 
          icon="fas fa-users" 
          label="Users" 
          active={path.includes('/admin/users')} 
          isCollapsed={!isOpen}
        >
          {isOpen && (
            <>
              <SubMenuItem 
                to="/admin/users" 
                label="All Users" 
                active={path === '/admin/users'} 
              />
              <SubMenuItem 
                to="/admin/users/new" 
                label="Add User" 
                active={path === '/admin/users/new'} 
              />
              <SubMenuItem 
                to="/admin/users/roles" 
                label="Roles & Permissions" 
                active={path === '/admin/users/roles'} 
              />
            </>
          )}
        </SidebarItem>
        
        <SidebarItem 
          to="/admin/logs" 
          icon="fas fa-list" 
          label="Logs" 
          active={path.includes('/admin/logs')} 
          isCollapsed={!isOpen}
        >
          {isOpen && (
            <>
              <SubMenuItem 
                to="/admin/logs" 
                label="Log Explorer" 
                active={path === '/admin/logs'} 
              />
              <SubMenuItem 
                to="/admin/logs/alerts" 
                label="Alerts" 
                active={path === '/admin/logs/alerts'} 
              />
              <SubMenuItem 
                to="/admin/logs/reports" 
                label="Reports" 
                active={path === '/admin/logs/reports'} 
              />
            </>
          )}
        </SidebarItem>
        
        <SidebarItem 
          to="/admin/settings" 
          icon="fas fa-cog" 
          label="Settings" 
          active={path.includes('/admin/settings')} 
          isCollapsed={!isOpen}
        />
      </div>
      
      {isOpen && (
        <div className="px-4 py-2 absolute bottom-0 border-t w-full">
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 flex items-center">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Site
          </Link>
        </div>
      )}
    </div>
  );
};

