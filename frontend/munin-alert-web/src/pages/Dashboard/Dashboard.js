import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data when component mounts
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent alerts
        const alertsResponse = await axios.get('/api/alerts/recent');
        setAlerts(alertsResponse.data);
        
        // Fetch user's groups
        const groupsResponse = await axios.get('/api/groups/user');
        setGroups(groupsResponse.data);
        
        // Fetch recent events
        const eventsResponse = await axios.get('/api/events/recent');
        setRecentEvents(eventsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
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
  if (error) return <div className="error">{error}</div>;

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
