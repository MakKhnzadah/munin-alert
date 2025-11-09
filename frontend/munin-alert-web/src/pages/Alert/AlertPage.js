import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './AlertPage.css';

const AlertPage = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  
  // New alert form state
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    alertType: 'EMERGENCY',
    groupId: '',
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch alerts
        const alertsResponse = await axios.get('/api/alerts');
        setAlerts(alertsResponse.data);
        
        // Fetch user's groups
        const groupsResponse = await axios.get('/api/groups/user');
        setGroups(groupsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching alerts data:', err);
        setError('Failed to load alerts. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Format date for display
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlert(prev => ({ ...prev, [name]: value }));
  };
  
  // Start countdown for alert
  const startAlertCountdown = () => {
    if (!newAlert.groupId) {
      setError('Please select a group');
      return;
    }
    
    let count = 5;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(interval);
        sendAlert();
      }
    }, 1000);
  };
  
  // Cancel alert countdown
  const cancelCountdown = () => {
    setCountdown(null);
  };
  
  // Send alert to server
  const sendAlert = async () => {
    try {
      const alertData = {
        ...newAlert,
        userId: user.id
      };
      
      const response = await axios.post('/api/alerts', alertData);
      
      // Add new alert to the list
      setAlerts(prev => [response.data, ...prev]);
      
      // Reset form
      setNewAlert({
        alertType: 'EMERGENCY',
        groupId: '',
        message: '',
      });
      
      setShowNewAlert(false);
      setCountdown(null);
    } catch (err) {
      console.error('Error sending alert:', err);
      setError('Failed to send alert. Please try again.');
      setCountdown(null);
    }
  };
  
  // Resolve an alert
  const resolveAlert = async (alertId) => {
    try {
      await axios.put(`/api/alerts/${alertId}/resolve`);
      
      // Update alert in the list
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, status: 'RESOLVED' } : alert
      ));
    } catch (err) {
      console.error('Error resolving alert:', err);
      setError('Failed to resolve alert. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading alerts...</div>;

  return (
    <div className="alert-page">
      <div className="alert-header">
        <h1>Alerts</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowNewAlert(!showNewAlert)}
        >
          {showNewAlert ? 'Cancel' : 'New Alert'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Countdown overlay */}
      {countdown !== null && (
        <div className="countdown-overlay">
          <div className="countdown-container">
            <h2>SENDING ALERT IN</h2>
            <div className="countdown-number">{countdown}</div>
            <p>Tap to cancel</p>
            <button className="btn btn-danger" onClick={cancelCountdown}>
              Cancel Alert
            </button>
          </div>
        </div>
      )}
      
      {/* New Alert Form */}
      {showNewAlert && (
        <div className="alert-form-container">
          <h2>Create New Alert</h2>
          <form className="alert-form">
            <div className="form-group">
              <label htmlFor="alertType">Alert Type</label>
              <select 
                id="alertType" 
                name="alertType" 
                value={newAlert.alertType}
                onChange={handleInputChange}
              >
                <option value="EMERGENCY">Emergency</option>
                <option value="MEDICAL">Medical</option>
                <option value="SAFETY">Safety</option>
                <option value="SECURITY">Security</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="groupId">Send To</label>
              <select 
                id="groupId" 
                name="groupId" 
                value={newAlert.groupId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a group</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message (optional)</label>
              <textarea 
                id="message" 
                name="message" 
                value={newAlert.message}
                onChange={handleInputChange}
                placeholder="Describe your situation..."
              />
            </div>
            
            <button 
              type="button" 
              className="btn btn-danger btn-large"
              onClick={startAlertCountdown}
            >
              Send Alert
            </button>
          </form>
        </div>
      )}
      
      {/* Alert List */}
      <div className="alert-list-container">
        <h2>Your Alerts</h2>
        
        {alerts.length === 0 ? (
          <p className="empty-state">No alerts found</p>
        ) : (
          <div className="alert-tabs">
            <button className="tab active">All</button>
            <button className="tab">Active</button>
            <button className="tab">Resolved</button>
          </div>
        )}
        
        <ul className="alerts-list">
          {alerts.map(alert => (
            <li key={alert.id} className={`alert-card ${alert.status.toLowerCase()}`}>
              <div className="alert-header">
                <div className="alert-type">{alert.alertType}</div>
                <div className="alert-status">{alert.status}</div>
              </div>
              
              <div className="alert-body">
                <p className="alert-message">
                  {alert.message || 'No message provided'}
                </p>
              </div>
              
              <div className="alert-footer">
                <div className="alert-time">
                  {formatDate(alert.createdAt)}
                </div>
                
                {alert.status === 'ACTIVE' && (
                  <button 
                    className="btn btn-small btn-success"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolve
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AlertPage;
