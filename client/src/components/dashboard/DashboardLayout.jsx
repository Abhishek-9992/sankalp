import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';

const DashboardLayout = ({
  children,
  activeTab,
  onTabChange,
  onNewIssue,
  userType = 'public'
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 lg:static lg:inset-0
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          onNewIssue={onNewIssue}
          userType={userType}
          isCollapsed={sidebarCollapsed}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Desktop sidebar toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebarCollapse}
                className="hidden lg:flex"
              >
                {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </Button>

              {/* Page title */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900 capitalize">
                  {activeTab?.replace(/([A-Z])/g, ' $1').trim() || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  {getPageDescription(activeTab, userType)}
                </p>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center space-x-3">
              {/* Quick action button */}
              {userType === 'public' && activeTab !== 'report' && (
                <Button
                  onClick={onNewIssue}
                  size="sm"
                  className="hidden sm:flex items-center space-x-1"
                >
                  <span>Report Issue</span>
                </Button>
              )}

              {/* Notification indicator */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1"></div>
                  <span className="text-sm">🔔</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper function to get page descriptions
const getPageDescription = (activeTab, userType) => {
  const descriptions = {
    public: {
      dashboard: 'Overview of your reported issues and community updates',
      issues: 'Track the status of issues you have reported',
      map: 'View all community issues on an interactive map',
      report: 'Report a new issue in your community'
    },
    ngo: {
      dashboard: 'Your volunteer dashboard and impact overview',
      issues: 'Issues available for resolution',
      assigned: 'Issues currently assigned to you',
      map: 'Navigate to issue locations',
      performance: 'Your volunteer performance and rankings'
    },
    government: {
      dashboard: 'System-wide overview and key metrics',
      issues: 'All reported issues across the system',
      analytics: 'Detailed analytics and reporting',
      oversight: 'Administrative controls and system management',
      map: 'Geographic distribution of issues'
    },
    school: {
      dashboard: 'School management overview',
      attendance: 'Daily student attendance tracking',
      meals: 'Meal distribution and monitoring',
      health: 'Student health and BMI tracking'
    }
  };

  return descriptions[userType]?.[activeTab] || 'Manage your account and settings';
};

export default DashboardLayout;