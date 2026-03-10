import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatUserType } from '../../utils/helpers';
import {
  Home,
  AlertTriangle,
  MapPin,
  User,
  Settings,
  LogOut,
  Plus,
  List,
  BarChart3,
  Bell,
  HelpCircle
} from 'lucide-react';

const Sidebar = ({
  activeTab,
  onTabChange,
  onNewIssue,
  userType = 'public',
  isCollapsed = false
}) => {
  const { userData, signOut } = useAuth();
  const { t } = useLanguage();

  const getMenuItems = () => {
    const baseItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
        description: 'Overview and statistics'
      },
      {
        id: 'issues',
        label: 'My Issues',
        icon: List,
        description: 'Issues you have reported'
      },
      {
        id: 'map',
        label: 'Issue Map',
        icon: MapPin,
        description: 'View issues on map'
      }
    ];

    // Add user-type specific items
    switch (userType) {
      case 'public':
        return [
          ...baseItems,
          {
            id: 'report',
            label: 'Report Issue',
            icon: Plus,
            description: 'Report a new issue',
            primary: true
          }
        ];

      case 'ngo':
        return [
          ...baseItems,
          {
            id: 'assigned',
            label: 'Assigned Issues',
            icon: AlertTriangle,
            description: 'Issues assigned to you'
          },
          {
            id: 'performance',
            label: 'Performance',
            icon: BarChart3,
            description: 'Your impact metrics'
          }
        ];

      case 'government':
        return [
          ...baseItems,
          {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart3,
            description: 'System-wide analytics'
          },
          {
            id: 'oversight',
            label: 'Oversight',
            icon: Settings,
            description: 'Administrative controls'
          }
        ];

      case 'school':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            description: 'School overview'
          },
          {
            id: 'attendance',
            label: 'Attendance',
            icon: List,
            description: 'Student attendance tracking'
          },
          {
            id: 'meals',
            label: 'Meal Distribution',
            icon: AlertTriangle,
            description: 'Meal program management'
          },
          {
            id: 'health',
            label: 'Health Monitoring',
            icon: BarChart3,
            description: 'Student health tracking'
          }
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => item.id === 'report' ? onNewIssue?.() : onTabChange?.(item.id)}
                  className={`w-full p-3 flex items-center justify-center rounded-lg mx-2 transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : item.primary
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={item.label}
                >
                  <IconComponent className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Actions */}
        <div className="p-2 border-t border-gray-200 space-y-2">
          <button
            className="w-full p-3 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={handleSignOut}
            className="w-full p-3 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">PEHM System</h1>
            <p className="text-xs text-gray-500">Poverty • Education • Hunger</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userData?.fullName || userData?.schoolName || 'User'}
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {formatUserType(userType)}
              </Badge>
              {userData?.isVerified && (
                <Badge className="text-xs bg-green-100 text-green-800">
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => item.id === 'report' ? onNewIssue?.() : onTabChange?.(item.id)}
                className={`w-full p-3 flex items-center space-x-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : item.primary
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  {!isActive && (
                    <div className="text-xs opacity-75 truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-gray-200 space-y-2">
        <button className="w-full p-3 flex items-center space-x-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
        </button>

        <button className="w-full p-3 flex items-center space-x-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          <HelpCircle className="h-5 w-5" />
          <span>Help & Support</span>
        </button>

        <button className="w-full p-3 flex items-center space-x-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>

        <button
          onClick={handleSignOut}
          className="w-full p-3 flex items-center space-x-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;