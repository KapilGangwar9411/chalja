import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, update, query, orderByChild } from 'firebase/database';
import { auth, database } from '../firebase';
import '../assets/styles.css';
import Loader from '../components/Loader';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'admins', 'users'
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

  useEffect(() => {
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

          console.log('All users:', usersData);
          console.log('Pending admins:', pendingData);
          console.log('Approved admins:', approvedData);

          setUsers(usersData);
          setPendingAdmins(pendingData);
          setApprovedAdmins(approvedData);
        } else {
          console.log('No users found');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users data');
      } finally {
        setLoading(false);
      }
    };

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

  return (
    <div className="super-admin-dashboard">
      <div className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
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
    </div>
  );
};

export default SuperAdminDashboard; 