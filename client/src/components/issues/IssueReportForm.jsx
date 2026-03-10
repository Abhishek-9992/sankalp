import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { IssueService } from '../../services/database';
import { ISSUE_TYPES, SEVERITY_LEVELS, ISSUE_STATUS } from '../../lib/schemas';
import { getCurrentLocation, validateFile } from '../../utils/helpers';
import LeafletMap from '../maps/LeafletMap';
import {
  MapPin,
  Camera,
  Upload,
  X,
  AlertTriangle,
  FileText,
  Send,
  Loader2
} from 'lucide-react';

const IssueReportForm = ({ onSubmitSuccess, onCancel }) => {
  const { t } = useLanguage();
  const { userData } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issueType: '',
    severity: '',
    location: null,
    photos: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const issueTypes = [
    { value: ISSUE_TYPES.POVERTY, label: 'Poverty Related', icon: '🏠', color: 'bg-blue-100 text-blue-800' },
    { value: ISSUE_TYPES.EDUCATION, label: 'Education Related', icon: '📚', color: 'bg-green-100 text-green-800' },
    { value: ISSUE_TYPES.HUNGER, label: 'Hunger Related', icon: '🍽️', color: 'bg-orange-100 text-orange-800' }
  ];

  const severityLevels = [
    { value: SEVERITY_LEVELS.LOW, label: 'Low', color: 'bg-yellow-100 text-yellow-800' },
    { value: SEVERITY_LEVELS.MEDIUM, label: 'Medium', color: 'bg-orange-100 text-orange-800' },
    { value: SEVERITY_LEVELS.HIGH, label: 'High', color: 'bg-red-100 text-red-800' },
    { value: SEVERITY_LEVELS.CRITICAL, label: 'Critical', color: 'bg-red-200 text-red-900' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      issueType: type
    }));
    if (errors.issueType) {
      setErrors(prev => ({ ...prev, issueType: '' }));
    }
  };

  const handleSeveritySelect = (severity) => {
    setFormData(prev => ({
      ...prev,
      severity
    }));
    if (errors.severity) {
      setErrors(prev => ({ ...prev, severity: '' }));
    }
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
    setShowLocationPicker(false);
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const location = await getCurrentLocation();
      handleLocationSelect(location);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        location: 'Could not get your current location. Please select manually on the map.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const validation = validateFile(file);
      if (!validation.valid) {
        setErrors(prev => ({
          ...prev,
          photos: validation.error
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          file,
          preview: event.target.result,
          name: file.name
        };

        setUploadedPhotos(prev => [...prev, newPhoto]);
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, file]
        }));
      };
      reader.readAsDataURL(file);
    });

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (photoId) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, index) =>
        uploadedPhotos.findIndex(photo => photo.id === photoId) !== index
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Issue title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Issue description is required';
    }

    if (!formData.issueType) {
      newErrors.issueType = 'Please select an issue type';
    }

    if (!formData.severity) {
      newErrors.severity = 'Please select severity level';
    }

    if (!formData.location) {
      newErrors.location = 'Please select the issue location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Upload photos to Firebase Storage and get URLs
      const photoUrls = []; // This would contain the uploaded photo URLs

      const issueData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        issueType: formData.issueType,
        severity: formData.severity,
        status: ISSUE_STATUS.REPORTED,
        location: {
          latitude: formData.location.latitude,
          longitude: formData.location.longitude,
          address: '', // TODO: Reverse geocoding to get address
          city: '',
          state: '',
          country: 'India'
        },
        photos: photoUrls,
        reportedBy: userData.id,
        viewCount: 0,
        upvotes: 0,
        tags: [formData.issueType]
      };

      const issueId = await IssueService.createIssue(issueData);

      if (onSubmitSuccess) {
        onSubmitSuccess(issueId);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        issueType: '',
        severity: '',
        location: null,
        photos: []
      });
      setUploadedPhotos([]);

    } catch (error) {
      console.error('Error submitting issue:', error);
      setErrors({
        general: 'Failed to submit issue. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <span>Report an Issue</span>
          </CardTitle>
          <p className="text-gray-600">
            Help your community by reporting poverty, education, or hunger-related issues
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Issue Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Issue Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {issueTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeSelect(type.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.issueType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <Badge className={type.color}>
                          {type.value}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.issueType && (
                <p className="text-sm text-red-600">{errors.issueType}</p>
              )}
            </div>

            {/* Severity Level */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Severity Level *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {severityLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleSeveritySelect(level.value)}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      formData.severity === level.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Badge className={level.color}>
                      {level.label}
                    </Badge>
                  </button>
                ))}
              </div>
              {errors.severity && (
                <p className="text-sm text-red-600">{errors.severity}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Issue Title *
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? 'border-red-500' : ''}
                placeholder="Brief description of the issue"
                maxLength={100}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{errors.title || ''}</span>
                <span>{formData.title.length}/100</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Detailed Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full min-h-[120px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Provide detailed information about the issue, including what you observed, when it occurred, and any other relevant details..."
                maxLength={500}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{errors.description || ''}</span>
                <span>{formData.description.length}/500</span>
              </div>
            </div>

            {/* Location Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Issue Location *
              </label>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetCurrentLocation}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span>Use Current Location</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLocationPicker(true)}
                  className="flex items-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Select on Map</span>
                </Button>
              </div>

              {formData.location && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-700">
                    📍 Location selected: {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              {errors.location && (
                <p className="text-sm text-red-600">{errors.location}</p>
              )}

              {/* Map for location selection */}
              {(showLocationPicker || formData.location) && (
                <div className="border rounded-lg overflow-hidden">
                  <LeafletMap
                    height="300px"
                    showLocationPicker={showLocationPicker}
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={formData.location}
                    zoom={15}
                  />
                </div>
              )}
            </div>

            {/* Photo Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Photos (Optional)
              </label>
              <p className="text-xs text-gray-500">
                Upload photos to provide visual evidence of the issue
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Photos</span>
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum 5MB per file. JPEG, PNG supported.
                </p>
              </div>

              {errors.photos && (
                <p className="text-sm text-red-600">{errors.photos}</p>
              )}

              {/* Photo Preview */}
              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedPhotos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.preview}
                        alt={photo.name}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {photo.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Submitting...' : 'Submit Issue Report'}</span>
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default IssueReportForm;