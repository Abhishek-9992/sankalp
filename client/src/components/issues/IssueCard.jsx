import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  getSeverityColor,
  getStatusColor,
  formatDateTime,
  truncateText
} from '../../utils/helpers';
import {
  MapPin,
  Clock,
  Eye,
  ThumbsUp,
  User,
  Camera,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

const IssueCard = ({
  issue,
  onViewDetails,
  onViewOnMap,
  showActions = true,
  compact = false
}) => {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(issue);
    }
  };

  const handleViewOnMap = () => {
    if (onViewOnMap) {
      onViewOnMap(issue);
    }
  };

  const getIssueTypeIcon = (type) => {
    switch (type) {
      case 'poverty':
        return '🏠';
      case 'education':
        return '📚';
      case 'hunger':
        return '🍽️';
      default:
        return '📋';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return '✅';
      case 'in_progress':
        return '🔄';
      case 'reported':
        return '📢';
      default:
        return '📋';
    }
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewDetails}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{getIssueTypeIcon(issue.issueType)}</span>
                <Badge className={getSeverityColor(issue.severity)}>
                  {issue.severity}
                </Badge>
                <Badge className={getStatusColor(issue.status)}>
                  {getStatusIcon(issue.status)} {issue.status.replace('_', ' ')}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1 truncate">
                {issue.title}
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                {truncateText(issue.description, 80)}
              </p>
              <div className="flex items-center text-xs text-gray-500 space-x-3">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDateTime(issue.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{issue.location?.city || 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getIssueTypeIcon(issue.issueType)}</span>
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {issue.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getSeverityColor(issue.severity)}>
                  {issue.severity}
                </Badge>
                <Badge className={getStatusColor(issue.status)}>
                  {getStatusIcon(issue.status)} {issue.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>

          {issue.photos && issue.photos.length > 0 && (
            <div className="flex items-center space-x-1 text-gray-500">
              <Camera className="h-4 w-4" />
              <span className="text-sm">{issue.photos.length}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 mb-4 leading-relaxed">
          {truncateText(issue.description, 200)}
        </p>

        {/* Issue Metadata */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Reported: {formatDateTime(issue.createdAt)}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>
              {issue.location?.address ||
               `${issue.location?.city || 'Unknown Location'}`}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <User className="h-4 w-4" />
            <span>Reporter ID: {issue.reportedBy?.slice(-8) || 'Anonymous'}</span>
          </div>

          {issue.resolvedAt && (
            <div className="flex items-center space-x-2 text-green-600">
              <Clock className="h-4 w-4" />
              <span>Resolved: {formatDateTime(issue.resolvedAt)}</span>
            </div>
          )}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{issue.viewCount || 0} views</span>
          </div>

          <div className="flex items-center space-x-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{issue.upvotes || 0} upvotes</span>
          </div>

          {issue.assignedTo && (
            <div className="flex items-center space-x-1 text-blue-600">
              <User className="h-4 w-4" />
              <span>Assigned</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {issue.tags && issue.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {issue.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Photo Preview */}
        {issue.photos && issue.photos.length > 0 && (
          <div className="mb-4">
            <div className="flex space-x-2 overflow-x-auto">
              {issue.photos.slice(0, 3).map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Issue photo ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border flex-shrink-0"
                />
              ))}
              {issue.photos.length > 3 && (
                <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                  +{issue.photos.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resolution Notes */}
        {issue.status === 'resolved' && issue.resolutionNotes && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
            <h4 className="text-sm font-medium text-green-800 mb-1">
              Resolution Notes:
            </h4>
            <p className="text-sm text-green-700">
              {truncateText(issue.resolutionNotes, 150)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="flex items-center space-x-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Details</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleViewOnMap}
              className="flex items-center space-x-1"
            >
              <MapPin className="h-4 w-4" />
              <span>View on Map</span>
            </Button>

            {issue.status !== 'resolved' && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Upvote</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Comment</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IssueCard;