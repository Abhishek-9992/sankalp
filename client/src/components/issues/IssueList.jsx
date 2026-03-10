import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import IssueCard from './IssueCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { IssueService } from '../../services/database';
import { ISSUE_TYPES, SEVERITY_LEVELS, ISSUE_STATUS } from '../../lib/schemas';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';

const IssueList = ({
  userId = null, // If provided, shows only user's issues
  onIssueSelect,
  onViewOnMap,
  showFilters = true,
  compact = false,
  title = "Issues"
}) => {
  const { t } = useLanguage();

  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Load issues
  useEffect(() => {
    loadIssues();
  }, [userId]);

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch();
  }, [issues, searchTerm, selectedType, selectedSeverity, selectedStatus, sortBy, sortOrder]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError('');

      let issuesData;
      if (userId) {
        // Load user's issues
        issuesData = await IssueService.getIssuesByReporter(userId);
      } else {
        // Load all issues
        issuesData = await IssueService.getAll('issues');
      }

      setIssues(issuesData);
    } catch (err) {
      console.error('Error loading issues:', err);
      setError('Failed to load issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...issues];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(term) ||
        issue.description.toLowerCase().includes(term) ||
        issue.location?.city?.toLowerCase().includes(term) ||
        issue.location?.address?.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(issue => issue.issueType === selectedType);
    }

    // Severity filter
    if (selectedSeverity) {
      filtered = filtered.filter(issue => issue.severity === selectedSeverity);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(issue => issue.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt?.toDate?.() || a.createdAt);
          bValue = new Date(b.createdAt?.toDate?.() || b.createdAt);
          break;
        case 'severity':
          const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          aValue = severityOrder[a.severity] || 0;
          bValue = severityOrder[b.severity] || 0;
          break;
        case 'upvotes':
          aValue = a.upvotes || 0;
          bValue = b.upvotes || 0;
          break;
        case 'viewCount':
          aValue = a.viewCount || 0;
          bValue = b.viewCount || 0;
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredIssues(filtered);
  };

  const handleRefresh = () => {
    loadIssues();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedSeverity('');
    setSelectedStatus('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const getStatusStats = () => {
    const stats = {
      total: issues.length,
      reported: issues.filter(i => i.status === ISSUE_STATUS.REPORTED).length,
      inProgress: issues.filter(i => i.status === ISSUE_STATUS.IN_PROGRESS).length,
      resolved: issues.filter(i => i.status === ISSUE_STATUS.RESOLVED).length
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading issues...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-primary" />
              <span>{title}</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center space-x-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.reported}</div>
              <div className="text-sm text-gray-600">Reported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
          </div>

          {/* Search and Filters */}
          {showFilters && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search issues by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className="flex items-center space-x-1"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center space-x-1"
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                  <span>Sort</span>
                </Button>

                {(searchTerm || selectedType || selectedSeverity || selectedStatus) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear Filters
                  </Button>
                )}

                <div className="text-sm text-gray-600">
                  Showing {filteredIssues.length} of {issues.length} issues
                </div>
              </div>

              {/* Expanded Filters Panel */}
              {showFiltersPanel && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  {/* Issue Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      <option value={ISSUE_TYPES.POVERTY}>Poverty</option>
                      <option value={ISSUE_TYPES.EDUCATION}>Education</option>
                      <option value={ISSUE_TYPES.HUNGER}>Hunger</option>
                    </select>
                  </div>

                  {/* Severity Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity
                    </label>
                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">All Severities</option>
                      <option value={SEVERITY_LEVELS.LOW}>Low</option>
                      <option value={SEVERITY_LEVELS.MEDIUM}>Medium</option>
                      <option value={SEVERITY_LEVELS.HIGH}>High</option>
                      <option value={SEVERITY_LEVELS.CRITICAL}>Critical</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      <option value={ISSUE_STATUS.REPORTED}>Reported</option>
                      <option value={ISSUE_STATUS.IN_PROGRESS}>In Progress</option>
                      <option value={ISSUE_STATUS.RESOLVED}>Resolved</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="createdAt">Date Created</option>
                      <option value="severity">Severity</option>
                      <option value="upvotes">Upvotes</option>
                      <option value="viewCount">Views</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No issues found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedType || selectedSeverity || selectedStatus
                  ? 'Try adjusting your filters or search terms.'
                  : 'No issues have been reported yet.'}
              </p>
              {(searchTerm || selectedType || selectedSeverity || selectedStatus) && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-6 ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onViewDetails={onIssueSelect}
              onViewOnMap={onViewOnMap}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueList;