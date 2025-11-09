import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './GroupsPage.css';

const GroupsPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  
  // New group form state
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    settings: {
      allowMemberInvites: false,
      autoShareLocationOnAlert: true,
      notifyAllOnAlert: true,
      alertCountdownSeconds: 5,
    }
  });
  
  // New member form state
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch user's groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/groups/user');
      setGroups(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups. Please try again later.');
      setLoading(false);
    }
  };
  
  // Fetch group details
  const fetchGroupDetails = async (groupId) => {
    try {
      const response = await axios.get(`/api/groups/${groupId}`);
      setSelectedGroup(response.data);
    } catch (err) {
      console.error('Error fetching group details:', err);
      setError('Failed to load group details. Please try again later.');
    }
  };

  // Handle group selection
  const handleSelectGroup = (groupId) => {
    fetchGroupDetails(groupId);
  };
  
  // Handle form input changes for new group
  const handleGroupInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle settings changes for new group
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setNewGroup(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: type === 'number' ? parseInt(val) : val
      }
    }));
  };
  
  // Create new group
  const createGroup = async (e) => {
    e.preventDefault();
    try {
      const groupData = {
        ...newGroup,
        ownerId: user.id,
      };
      
      const response = await axios.post('/api/groups', groupData);
      
      // Add new group to list
      setGroups(prev => [...prev, response.data]);
      
      // Reset form
      setNewGroup({
        name: '',
        description: '',
        settings: {
          allowMemberInvites: false,
          autoShareLocationOnAlert: true,
          notifyAllOnAlert: true,
          alertCountdownSeconds: 5,
        }
      });
      
      setShowNewGroupForm(false);
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group. Please try again.');
    }
  };
  
  // Add member to group
  const addMember = async (e, groupId) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    
    try {
      await axios.post(`/api/groups/${groupId}/members`, { email: newMemberEmail });
      
      // Refresh group details
      fetchGroupDetails(groupId);
      
      // Reset form
      setNewMemberEmail('');
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member. Please check the email and try again.');
    }
  };
  
  // Remove member from group
  const removeMember = async (groupId, memberId) => {
    try {
      await axios.delete(`/api/groups/${groupId}/members/${memberId}`);
      
      // Refresh group details
      fetchGroupDetails(groupId);
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member. Please try again.');
    }
  };
  
  // Format date for display
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) return <div className="loading">Loading groups...</div>;

  return (
    <div className="groups-page">
      <div className="groups-header">
        <h1>Groups</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowNewGroupForm(!showNewGroupForm)}
        >
          {showNewGroupForm ? 'Cancel' : 'Create Group'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* New Group Form */}
      {showNewGroupForm && (
        <div className="group-form-container">
          <h2>Create New Group</h2>
          <form className="group-form" onSubmit={createGroup}>
            <div className="form-group">
              <label htmlFor="name">Group Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newGroup.name}
                onChange={handleGroupInputChange}
                placeholder="Family, Friends, Work Team, etc."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newGroup.description}
                onChange={handleGroupInputChange}
                placeholder="Describe the purpose of this group..."
              />
            </div>
            
            <h3>Group Settings</h3>
            
            <div className="form-check">
              <input
                type="checkbox"
                id="allowMemberInvites"
                name="allowMemberInvites"
                checked={newGroup.settings.allowMemberInvites}
                onChange={handleSettingsChange}
              />
              <label htmlFor="allowMemberInvites">
                Allow members to invite others
              </label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                id="autoShareLocationOnAlert"
                name="autoShareLocationOnAlert"
                checked={newGroup.settings.autoShareLocationOnAlert}
                onChange={handleSettingsChange}
              />
              <label htmlFor="autoShareLocationOnAlert">
                Automatically share location during alerts
              </label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                id="notifyAllOnAlert"
                name="notifyAllOnAlert"
                checked={newGroup.settings.notifyAllOnAlert}
                onChange={handleSettingsChange}
              />
              <label htmlFor="notifyAllOnAlert">
                Notify all members during alerts
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="alertCountdownSeconds">
                Alert countdown (seconds)
              </label>
              <input
                type="number"
                id="alertCountdownSeconds"
                name="alertCountdownSeconds"
                min="0"
                max="30"
                value={newGroup.settings.alertCountdownSeconds}
                onChange={handleSettingsChange}
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Create Group
            </button>
          </form>
        </div>
      )}
      
      <div className="groups-container">
        {/* Groups List */}
        <div className="groups-list">
          <h2>Your Groups</h2>
          
          {groups.length === 0 ? (
            <p className="empty-state">You don't have any groups yet</p>
          ) : (
            <ul>
              {groups.map(group => (
                <li 
                  key={group.id} 
                  className={`group-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
                  onClick={() => handleSelectGroup(group.id)}
                >
                  <h3>{group.name}</h3>
                  <p className="member-count">
                    {group.memberIds?.length || 0} members
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Group Details */}
        {selectedGroup && (
          <div className="group-details">
            <h2>{selectedGroup.name}</h2>
            <p className="group-description">
              {selectedGroup.description || 'No description provided'}
            </p>
            
            <div className="group-meta">
              <p><strong>Created:</strong> {formatDate(selectedGroup.createdAt)}</p>
              <p><strong>Owner:</strong> {selectedGroup.ownerId === user.id ? 'You' : selectedGroup.ownerId}</p>
            </div>
            
            <div className="group-settings">
              <h3>Group Settings</h3>
              <ul className="settings-list">
                <li>
                  <span>Allow member invites:</span>
                  <span>{selectedGroup.settings?.allowMemberInvites ? 'Yes' : 'No'}</span>
                </li>
                <li>
                  <span>Auto-share location on alert:</span>
                  <span>{selectedGroup.settings?.autoShareLocationOnAlert ? 'Yes' : 'No'}</span>
                </li>
                <li>
                  <span>Notify all on alert:</span>
                  <span>{selectedGroup.settings?.notifyAllOnAlert ? 'Yes' : 'No'}</span>
                </li>
                <li>
                  <span>Alert countdown:</span>
                  <span>{selectedGroup.settings?.alertCountdownSeconds || 5} seconds</span>
                </li>
              </ul>
            </div>
            
            <div className="group-members">
              <h3>Members</h3>
              
              <form className="add-member-form" onSubmit={(e) => addMember(e, selectedGroup.id)}>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
                <button type="submit" className="btn btn-small">
                  Add Member
                </button>
              </form>
              
              <ul className="members-list">
                {selectedGroup.memberIds?.map(memberId => (
                  <li key={memberId} className="member-item">
                    <div className="member-info">
                      <span>{memberId}</span>
                      {selectedGroup.adminIds?.includes(memberId) && (
                        <span className="admin-badge">Admin</span>
                      )}
                      {selectedGroup.ownerId === memberId && (
                        <span className="owner-badge">Owner</span>
                      )}
                    </div>
                    
                    {selectedGroup.ownerId === user.id && memberId !== user.id && (
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => removeMember(selectedGroup.id, memberId)}
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;
