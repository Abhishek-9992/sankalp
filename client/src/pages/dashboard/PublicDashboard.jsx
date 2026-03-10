import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import IssueReportForm from '../../components/issues/IssueReportForm';
import IssueList from '../../components/issues/IssueList';
import LeafletMap from '../../components/maps/LeafletMap';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { IssueService } from '../../services/database';
import { formatDateTime } from '../../utils/helpers';
import {
  AlertTriangle,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  ThumbsUp,
  Plus,
  RefreshCw
} from 'lucide-react';

const PublicDashboard = () => {
  const { userData } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [userIssues, setUserIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [userData]);

  const loadDashboardData = async () => {
    if (!userData?.id) return;

    try {
      setLoading(true);

      // Load user's issues
      const userIssuesData = await IssueService.getIssuesByReporter(userData.id);
      setUserIssues(userIssuesData);

      // Load all issues for map view
      const allIssuesData = await IssueService.getAll('issues');
      setAllIssues(allIssuesData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleNewIssue = () => {
    setActiveTab('report');
  };

  const handleIssueSubmitSuccess = (issueId) => {
    // Refresh data and go back to dashboard
    loadDashboardData();
    setActiveTab('dashboard');
  };

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    // Could open a modal or navigate to detail view
  };

  const handleViewOnMap = (issue) => {
    setSelectedIssue(issue);
    setActiveTab('map');
  };

  const getDashboardStats = () => {
    const stats = {
      totalReported: userIssues.length,
      resolved: userIssues.filter(issue => issue.status === 'resolved').length,
      inProgress: userIssues.filter(issue => issue.status === 'in_progress').length,
      pending: userIssues.filter(issue => issue.status === 'reported').length
    };

    stats.resolutionRate = stats.totalReported > 0
      ? Math.round((stats.resolved / stats.totalReported) * 100)
      : 0;

    return stats;
  };

  const getRecentActivity = () => {
    return userIssues
      .sort((a, b) => new Date(b.updatedAt?.toDate?.() || b.updatedAt) - new Date(a.updatedAt?.toDate?.() || a.updatedAt))
      .slice(0, 5);
  };

  const renderDashboardOverview = () => {
    const stats = getDashboardStats();
    const recentActivity = getRecentActivity();

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome back, {userData?.fullName}!
                </h2>
                <p className="text-gray-600">
                  Thank you for being an active member of our community. Your reports help make a difference.
                </p>
              </div>
              <Button onClick={handleNewIssue} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Report New Issue</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reported</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalReported}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.resolutionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((issue) => (
                    <div key={issue.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {issue.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`text-xs ${
                            issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            issue.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {issue.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(issue.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No issues reported yet</p>
                  <Button onClick={handleNewIssue} variant="outline" className="mt-4">
                    Report Your First Issue
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={handleNewIssue}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Report New Issue
                </Button>

                <Button
                  onClick={() => setActiveTab('issues')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View My Issues
                </Button>

                <Button
                  onClick={() => setActiveTab('map')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Explore Issue Map
                </Button>

                <Button
                  onClick={loadDashboardData}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'report':
        return (
          <IssueReportForm
            onSubmitSuccess={handleIssueSubmitSuccess}
            onCancel={() => setActiveTab('dashboard')}
          />
        );

      case 'issues':
        return (
          <IssueList
            userId={userData?.id}
            onIssueSelect={handleIssueSelect}
            onViewOnMap={handleViewOnMap}
            title="My Issues"
          />
        );

      case 'map':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-6 w-6" />
                  <span>Community Issues Map</span>
                </CardTitle>
                <p className="text-gray-600">
                  Explore issues reported in your community. Click on markers to view details.
                </p>
              </CardHeader>
              <CardContent>
                <LeafletMap
                  issues={allIssues}
                  height="600px"
                  onIssueClick={handleIssueSelect}
                />
              </CardContent>
            </Card>
          </div>
        );

      default:
        return renderDashboardOverview();
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onNewIssue={handleNewIssue}
      userType="public"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default PublicDashboard;