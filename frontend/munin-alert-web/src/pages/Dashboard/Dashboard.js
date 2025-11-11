import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

/**
 * Dashboard aggregates alerts, groups and recent events for the current user.
 * Original implementation used endpoints '/api/alerts/recent', '/api/groups/user', '/api/events/recent'
 * which do not exist in the backend. Adjusted to align with available controllers:
 *  - Alerts: GET /api/alerts returns alerts for current user (AlertController#getAllAlerts)
 *  - Groups: GET /api/groups returns groups where current user is a member (GroupController#getAllGroups)
 *  - Recent Events: GET /api/events/my-events/recent?limit=10 (EventController#getMyRecentEvents)
 * Enhanced error handling now distinguishes auth vs network vs generic errors.
 */

const Dashboard = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Alerts for current user
        const alertsResponse = await axios.get('/api/alerts');
        setAlerts(alertsResponse.data || []);

        // Groups for current user
        const groupsResponse = await axios.get('/api/groups');
        setGroups(groupsResponse.data || []);

        // Recent events for current user (limit 10)
        const eventsResponse = await axios.get('/api/events/my-events/recent?limit=10');
        setRecentEvents(eventsResponse.data || []);

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Granular error message
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            setError('Authorization failed. Please log in again.');
          } else {
            setError(`Server error (${err.response.status}). Could not load dashboard.`);
          }
        } else if (err.request) {
          setError('Network error: unable to reach server. Check your connection.');
        } else {
          setError('Unexpected error loading dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Get alert status class for styling
  const getAlertStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'alert-active';
      case 'RESOLVED': return 'alert-resolved';
      case 'PENDING': return 'alert-pending';
      default: return '';
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) {
    return (
      <div className="dashboard error-state">
        <h1>Dashboard</h1>
        <p className="error">{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName || 'User'}</h1>
        <p className="last-login">Last login: {formatDate(Date.now())}</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="btn btn-danger">Trigger Alert</button>
            <button className="btn btn-primary">New Group</button>
            <button className="btn btn-secondary">Add Contact</button>
            <button className="btn btn-info">View Safe Havens</button>
          </div>
        </div>
        
        {/* Recent Alerts */}
        <div className="dashboard-card recent-alerts">
          <h2>Recent Alerts</h2>
          {alerts.length === 0 ? (
            <p className="empty-state">No recent alerts</p>
          ) : (
            <ul className="alert-list">
              {alerts.map(alert => (
                <li key={alert.id} className={`alert-item ${getAlertStatusClass(alert.status)}`}>
                  <div className="alert-icon">⚠️</div>
                  <div className="alert-content">
                    <h3>{alert.alertType}</h3>
                    <p>{alert.message}</p>
                    <div className="alert-meta">
                      <span className="alert-timestamp">{formatDate(alert.createdAt)}</span>
                      <span className="alert-status">{alert.status}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Your Groups */}
        <div className="dashboard-card your-groups">
          <h2>Your Groups</h2>
          {groups.length === 0 ? (
            <p className="empty-state">You don't have any groups yet</p>
          ) : (
            <ul className="group-list">
              {groups.map(group => (
                <li key={group.id} className="group-item">
                  <h3>{group.name}</h3>
                  <p>{group.description}</p>
                  <div className="group-meta">
                    <span>{group.memberIds.length} members</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Recent Activity */}
        <div className="dashboard-card activity-feed">
          <h2>Recent Activity</h2>
          {recentEvents.length === 0 ? (
            <p className="empty-state">No recent activity</p>
          ) : (
            <ul className="event-list">
              {recentEvents.map(event => (
                <li key={event.id} className="event-item">
                  <div className="event-icon">📝</div>
                  <div className="event-content">
                    <h3>{event.eventType}</h3>
                    <p className="event-timestamp">{formatDate(event.timestamp)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
