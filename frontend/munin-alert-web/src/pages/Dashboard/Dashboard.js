import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';
import { useI18n } from '../../i18n/I18nContext';

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
  const navigate = useNavigate();
  const { t } = useI18n();
  const [alerts, setAlerts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quick Action handlers
  const handleTriggerAlert = () => {
    // Route to alerts page where user can create/trigger a new alert
    navigate('/alerts');
  };

  const handleNewGroup = () => {
    // Route to groups; pass state to optionally open create form if supported
    navigate('/groups', { state: { openCreate: true } });
  };

  const handleAddContact = () => {
    // Route to profile to manage contacts; adjust if a dedicated contacts page exists
    navigate('/profile', { state: { focus: 'contacts' } });
  };

  const handleViewSafeHavens = () => {
    // Map view that shows safe havens / points of interest
    navigate('/map', { state: { filter: 'safe-havens' } });
  };

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

  if (loading) return <div className="loading">{t('dashboard.loading')}</div>;
  if (error) {
    return (
      <div className="dashboard error-state">
        <h1>{t('nav.dashboard')}</h1>
        <p className="error">{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>{t('dashboard.retry')}</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('dashboard.welcome', { name: user?.firstName || 'User' })}</h1>
        <p className="last-login">{t('dashboard.lastLogin', { time: formatDate(Date.now()) })}</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <h2>{t('dashboard.quickActions')}</h2>
          <div className="action-buttons">
            <button className="btn btn-danger" onClick={handleTriggerAlert} aria-label={t('dashboard.actions.trigger')}>{t('dashboard.actions.trigger')}</button>
            <button className="btn btn-primary" onClick={handleNewGroup} aria-label={t('dashboard.actions.newGroup')}>{t('dashboard.actions.newGroup')}</button>
            <button className="btn btn-secondary" onClick={handleAddContact} aria-label={t('dashboard.actions.addContact')}>{t('dashboard.actions.addContact')}</button>
            <button className="btn btn-info" onClick={handleViewSafeHavens} aria-label={t('dashboard.actions.havens')}>{t('dashboard.actions.havens')}</button>
          </div>
        </div>
        
        {/* Recent Alerts */}
        <div className="dashboard-card recent-alerts">
          <h2>{t('dashboard.recentAlerts')}</h2>
          {alerts.length === 0 ? (
            <p className="empty-state">{t('dashboard.noRecentAlerts')}</p>
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
          <h2>{t('dashboard.yourGroups')}</h2>
          {groups.length === 0 ? (
            <p className="empty-state">{t('dashboard.noGroups')}</p>
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
          <h2>{t('dashboard.recentActivity')}</h2>
          {recentEvents.length === 0 ? (
            <p className="empty-state">{t('dashboard.noRecentActivity')}</p>
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
