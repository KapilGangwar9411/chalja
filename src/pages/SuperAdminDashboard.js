import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, update, query, orderByChild, set } from 'firebase/database';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import '../assets/styles.css';
import Loader from '../components/Loader';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'admins', 'users'
  const [showCreateSuperAdminModal, setShowCreateSuperAdminModal] = useState(false);
  const [newSuperAdminData, setNewSuperAdminData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [createSuperAdminError, setCreateSuperAdminError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/admin-login');
          return;
        }

        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (!snapshot.exists() || !snapshot.val().isSuperAdmin) {
          navigate('/admin-login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/admin-login');
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get all users
      const usersRef = ref(database, 'users');
      const usersSnapshot = await get(usersRef);

      if (usersSnapshot.exists()) {
        const usersData = [];
        const pendingData = [];
        const approvedData = [];

        usersSnapshot.forEach((childSnapshot) => {
          const user = {
            id: childSnapshot.key,
            ...childSnapshot.val()
          };

          usersData.push(user);
          // Check for pending admin requests
          if (user.isAdmin && !user.isApproved && !user.isSuperAdmin) {
            pendingData.push(user);
          }
          // Check for approved admins
          if (user.isAdmin && user.isApproved && !user.isSuperAdmin) {
            approvedData.push(user);
          }
        });

        setUsers(usersData);
        setPendingAdmins(pendingData);
        setApprovedAdmins(approvedData);
      } else {
        setUsers([]);
        setPendingAdmins([]);
        setApprovedAdmins([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproval = async (userId, approve) => {
    try {
      setError('');
      const userRef = ref(database, `users/${userId}`);
      
      // First verify the user still exists
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        throw new Error('User not found');
      }

      // Prepare update data - keep isAdmin true when approving
      const updateData = approve ? {
        isAdmin: true,
        isApproved: true
      } : {
        isAdmin: false,
        isApproved: false,
        isSuperAdmin: false
      };

      // Update the database
      await update(userRef, updateData);

      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            ...updateData
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setPendingAdmins(pendingAdmins.filter(admin => admin.id !== userId));
      
      // Update approved admins list
      if (approve) {
        const approvedUser = updatedUsers.find(user => user.id === userId);
        setApprovedAdmins([...approvedAdmins, approvedUser]);
      }

      // Show success message
      setError(`Admin request ${approve ? 'approved' : 'rejected'} successfully`);
      
      // Refresh the user list after a short delay
      setTimeout(async () => {
        try {
          const usersRef = ref(database, 'users');
          const snapshot = await get(usersRef);
          if (snapshot.exists()) {
            const usersData = [];
            const pendingData = [];
            const approvedData = [];

            snapshot.forEach((childSnapshot) => {
              const user = {
                id: childSnapshot.key,
                ...childSnapshot.val()
              };

              usersData.push(user);
              if (user.isAdmin && !user.isApproved && !user.isSuperAdmin) {
                pendingData.push(user);
              }
              if (user.isAdmin && user.isApproved && !user.isSuperAdmin) {
                approvedData.push(user);
              }
            });

            setUsers(usersData);
            setPendingAdmins(pendingData);
            setApprovedAdmins(approvedData);
          }
        } catch (refreshError) {
          console.error('Error refreshing users:', refreshError);
        }
      }, 1000);

      // Clear success message after 3 seconds
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('Error updating approval:', error);
      setError(`Failed to ${approve ? 'approve' : 'reject'} admin request: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout');
    }
  };

  const handleCreateSuperAdmin = async (e) => {
    e.preventDefault();
    setCreateSuperAdminError('');

    if (!newSuperAdminData.email || !newSuperAdminData.password || !newSuperAdminData.confirmPassword) {
      setCreateSuperAdminError('Please fill in all fields');
      return;
    }

    if (newSuperAdminData.password !== newSuperAdminData.confirmPassword) {
      setCreateSuperAdminError('Passwords do not match');
      return;
    }

    if (newSuperAdminData.password.length < 6) {
      setCreateSuperAdminError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      
      // Create new user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newSuperAdminData.email,
        newSuperAdminData.password
      );

      // Save user data to database
      const userData = {
        email: newSuperAdminData.email,
        isAdmin: true,
        isSuperAdmin: true,
        isApproved: true,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid
      };

      await set(ref(database, `users/${userCredential.user.uid}`), userData);

      // Clear form and close modal
      setNewSuperAdminData({
        email: '',
        password: '',
        confirmPassword: ''
      });
      setShowCreateSuperAdminModal(false);
      setError('Super admin account created successfully!');
      
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error creating super admin:', error);
      if (error.code === 'auth/email-already-in-use') {
        setCreateSuperAdminError('Email already in use');
      } else if (error.code === 'auth/invalid-email') {
        setCreateSuperAdminError('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        setCreateSuperAdminError('Password is too weak');
      } else {
        setCreateSuperAdminError('Failed to create super admin account');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderUserList = () => {
    let displayUsers = [];
    
    switch (activeTab) {
      case 'pending':
        displayUsers = pendingAdmins;
        break;
      case 'admins':
        displayUsers = approvedAdmins;
        break;
      case 'users':
        displayUsers = users.filter(user => 
          !user.isAdmin || 
          (user.isAdmin && !user.isApproved)
        );
        break;
      default:
        displayUsers = users;
    }

    return (
      <div className="users-list">
        {displayUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h3>{user.email}</h3>
              <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Status: {
                user.isSuperAdmin ? 'Super Admin' :
                user.isAdmin && user.isApproved ? 'Approved Admin' :
                user.isAdmin && !user.isApproved ? 'Pending Admin' :
                'Regular User'
              }</p>
              <p>Role: {
                user.isSuperAdmin ? 'Super Admin' :
                user.isAdmin && user.isApproved ? 'Admin' :
                'User'
              }</p>
            </div>
            {activeTab === 'pending' && (
              <div className="action-buttons">
                <button
                  className="approve-button"
                  onClick={() => handleApproval(user.id, true)}
                >
                  Approve
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleApproval(user.id, false)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
        {displayUsers.length === 0 && (
          <div className="no-data">
            No {activeTab === 'pending' ? 'pending requests' : activeTab} to display
          </div>
        )}
      </div>
    );
  };

  const CreateSuperAdminModal = () => (
    <div className="modal-overlay" onClick={() => setShowCreateSuperAdminModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Super Admin</h2>
          <button className="close-button" onClick={() => setShowCreateSuperAdminModal(false)}>×</button>
        </div>
        <form onSubmit={handleCreateSuperAdmin}>
          {createSuperAdminError && (
            <div className="error-message">{createSuperAdminError}</div>
          )}
          <div className="form-group">
            <label htmlFor="newSuperAdminEmail">Email</label>
            <input
              type="email"
              id="newSuperAdminEmail"
              value={newSuperAdminData.email}
              onChange={(e) => setNewSuperAdminData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newSuperAdminPassword">Password</label>
            <input
              type="password"
              id="newSuperAdminPassword"
              value={newSuperAdminData.password}
              onChange={(e) => setNewSuperAdminData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newSuperAdminConfirmPassword">Confirm Password</label>
            <input
              type="password"
              id="newSuperAdminConfirmPassword"
              value={newSuperAdminData.confirmPassword}
              onChange={(e) => setNewSuperAdminData(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
              placeholder="Confirm password"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowCreateSuperAdminModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Super Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="super-admin-dashboard">
      <div className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <div className="header-actions">
          <button 
            className="create-super-admin-button" 
            onClick={() => setShowCreateSuperAdminModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Create Super Admin
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="dashboard-message">{error}</div>}

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Requests ({pendingAdmins.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          Admins ({approvedAdmins.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        renderUserList()
      )}

      {showCreateSuperAdminModal && <CreateSuperAdminModal />}
    </div>
  );
};

export default SuperAdminDashboard; 