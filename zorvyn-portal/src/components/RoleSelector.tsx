import React, { useState } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { User, LogOut } from 'lucide-react';

export const RoleSelector: React.FC = () => {
  const { userRole, setUserRole } = useDashboardStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleChange = (role: 'viewer' | 'admin') => {
    setUserRole(role);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:shadow-lg transition-shadow duration-200"
      >
        <User className="w-4 h-4" />
        {userRole === 'admin' ? 'Admin Mode' : 'Viewer Mode'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
          <button
            onClick={() => handleRoleChange('viewer')}
            className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
              userRole === 'viewer'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <LogOut className="w-4 h-4 inline mr-2" />
            Viewer Mode (Read-only)
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors duration-200 border-t border-gray-200 dark:border-gray-700 ${
              userRole === 'admin'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Admin Mode (Full Access)
          </button>
        </div>
      )}
    </div>
  );
};
