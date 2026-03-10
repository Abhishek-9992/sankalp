import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCurrentLocation } from '../../utils/helpers';
import { getSeverityColor } from '../../utils/helpers';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different issue severities
const createCustomIcon = (severity, status) => {
  let color = '#3b82f6'; // default blue

  if (status === 'resolved') {
    color = '#10b981'; // green
  } else {
    switch (severity) {
      case 'low':
        color = '#f59e0b'; // yellow
        break;
      case 'medium':
        color = '#f97316'; // orange
        break;
      case 'high':
        color = '#ef4444'; // red
        break;
      case 'critical':
        color = '#dc2626'; // dark red
        break;
      default:
        color = '#3b82f6'; // blue
    }
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Component to handle map events and location
const MapController = ({ center, onLocationSelect, showLocationPicker }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  useEffect(() => {
    if (showLocationPicker) {
      const handleMapClick = (e) => {
        if (onLocationSelect) {
          onLocationSelect({
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          });
        }
      };

      map.on('click', handleMapClick);
      map.getContainer().style.cursor = 'crosshair';

      return () => {
        map.off('click', handleMapClick);
        map.getContainer().style.cursor = '';
      };
    }
  }, [showLocationPicker, onLocationSelect, map]);

  return null;
};

const LeafletMap = ({
  issues = [],
  center = [28.6139, 77.2090], // Default to Delhi
  zoom = 10,
  height = '400px',
  onIssueClick,
  onLocationSelect,
  showLocationPicker = false,
  selectedLocation = null,
  className = ''
}) => {
  const [mapCenter, setMapCenter] = useState(center);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user's current location
    getCurrentLocation()
      .then(location => {
        setUserLocation([location.latitude, location.longitude]);
        setMapCenter([location.latitude, location.longitude]);
      })
      .catch(error => {
        console.warn('Could not get user location:', error);
      });
  }, []);

  const handleIssueMarkerClick = (issue) => {
    if (onIssueClick) {
      onIssueClick(issue);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          center={mapCenter}
          onLocationSelect={onLocationSelect}
          showLocationPicker={showLocationPicker}
        />

        {/* User's current location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `
                <div style="
                  background-color: #3b82f6;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
                "></div>
              `,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })}
          >
            <Popup>
              <div className="text-sm">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Selected location marker (for issue reporting) */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.latitude, selectedLocation.longitude]}
            icon={L.divIcon({
              className: 'selected-location-marker',
              html: `
                <div style="
                  background-color: #10b981;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  animation: pulse 2s infinite;
                "></div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })}
          >
            <Popup>
              <div className="text-sm">
                <strong>Selected Location</strong>
                <br />
                Lat: {selectedLocation.latitude.toFixed(6)}
                <br />
                Lng: {selectedLocation.longitude.toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Issue markers */}
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.location.latitude, issue.location.longitude]}
            icon={createCustomIcon(issue.severity, issue.status)}
            eventHandlers={{
              click: () => handleIssueMarkerClick(issue)
            }}
          >
            <Popup>
              <div className="max-w-xs">
                <h3 className="font-semibold text-sm mb-2">{issue.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{issue.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${getSeverityColor(issue.severity)}`}>
                    {issue.severity}
                  </span>
                  <span className="text-gray-500">
                    {new Date(issue.createdAt?.toDate?.() || issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {issue.status === 'resolved' && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    ✓ Resolved
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map instructions for location picker */}
      {showLocationPicker && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
          <p className="text-sm text-gray-700">
            📍 Click on the map to select location
          </p>
        </div>
      )}

      {/* Map legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="text-xs font-semibold mb-2">Issue Severity</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-700"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Resolved</span>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LeafletMap;