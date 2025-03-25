import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebase';
import { signOut } from 'firebase/auth';
import { ref, get, update, remove, push } from 'firebase/database';
import Loader from '../components/Loader';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    pendingRequests: 0
  });
  const [joinRequests, setJoinRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        // Check if user is admin or super admin
        const userRef = ref(database, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setIsAdmin(userData.isAdmin || userData.isSuperAdmin);
          setIsSuperAdmin(userData.isSuperAdmin);
          
          if (!userData.isAdmin && !userData.isSuperAdmin) {
            setError('Access denied. You must be an admin to view this page.');
            return;
          }
        } else {
          setError('User data not found.');
          return;
        }
        
        fetchStats();
        fetchJoinRequests();
      } else {
        navigate('/admin-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const usersRef = ref(database, 'users');
      const postsRef = ref(database, 'posts');
      const commentsRef = ref(database, 'comments');
      const joinRequestsRef = ref(database, 'joinRequests');
      
      const [usersSnapshot, postsSnapshot, commentsSnapshot, requestsSnapshot] = await Promise.all([
        get(usersRef),
        get(postsRef),
        get(commentsRef),
        get(joinRequestsRef)
      ]);

      // Get all users that are approved
      let approvedUsers = [];
      if (usersSnapshot.exists()) {
        approvedUsers = Object.entries(usersSnapshot.val())
          .map(([id, data]) => ({
            id,
            ...data
          }))
          .filter(user => user.isApproved); // Only count approved users
        
        setAllUsers(approvedUsers); // Set all users state
      }

      // Count pending requests
      const pendingRequests = requestsSnapshot.exists() 
        ? Object.values(requestsSnapshot.val())
          .filter(request => request.status === 'pending' || !request.status).length 
        : 0;

      setStats({
        totalUsers: approvedUsers.length, // Use the length of approved users
        totalPosts: postsSnapshot.exists() ? Object.keys(postsSnapshot.val()).length : 0,
        totalComments: commentsSnapshot.exists() ? Object.keys(commentsSnapshot.val()).length : 0,
        pendingRequests
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinRequests = async () => {
    try {
      const joinRequestsRef = ref(database, 'joinRequests');
      const snapshot = await get(joinRequestsRef);
      
      if (snapshot.exists()) {
        const requests = Object.entries(snapshot.val())
          .map(([id, data]) => ({
            id,
            ...data
          }))
          .filter(request => request.status === 'pending' || !request.status) // Only show pending requests
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJoinRequests(requests);
      } else {
        setJoinRequests([]);
      }
    } catch (err) {
      console.error('Error fetching join requests:', err);
      setError('Failed to fetch join requests');
    }
  };

  const handleApproveRequest = async (requestId, phoneNumber, requestData) => {
    try {
      setLoading(true); // Show loader while processing

      // First, update the request status
      const requestRef = ref(database, `joinRequests/${requestId}`);
      await update(requestRef, {
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: currentUser.uid
      });

      // Your WhatsApp group invite link
      const whatsappGroupLink = "https://chat.whatsapp.com/K64zrdrxJwY9Y1Bnrf46nd";
      
      // Create a new user in the users node
      const newUserRef = ref(database, 'users');
      const newUser = {
        email: `${requestData.phone}@spectrum.com`,
        isAdmin: false,
        isSuperAdmin: false,
        isApproved: true, // Make sure to set this flag
        createdAt: new Date().toISOString(),
        name: requestData.name,
        phone: requestData.phone,
        branch: requestData.branch,
        year: requestData.year,
        interest: requestData.interest,
        whatsappGroupLink: whatsappGroupLink
      };

      // Push the new user data and get the reference
      const newUserSnapshot = await push(newUserRef, newUser);
      const newUserId = newUserSnapshot.key;

      // Update allUsers state immediately
      setAllUsers(prevUsers => [...prevUsers, {
        id: newUserId,
        ...newUser
      }]);

      // Send WhatsApp message with invite link
      const whatsappMessage = `Welcome to Spectrum, ${requestData.name}! 🎉\n\n` +
        `Your application has been approved. Please join our WhatsApp group using this link:\n` +
        `${whatsappGroupLink}\n\n` +
        `We're excited to have you as part of Spectrum!`;

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      // Update local stats immediately
      setStats(prevStats => ({
        ...prevStats,
        totalUsers: prevStats.totalUsers + 1,
        pendingRequests: prevStats.pendingRequests - 1
      }));

      // Remove the request from joinRequests state
      setJoinRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );

      // Show success message
      setError(null);
    } catch (err) {
      console.error('Error approving request:', err);
      setError('Failed to approve request. Please try again.');
    } finally {
      setLoading(false); // Hide loader after processing
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      // Delete the request from the database
      const requestRef = ref(database, `joinRequests/${requestId}`);
      await remove(requestRef);

      // Remove the request from joinRequests state
      setJoinRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );

      // Update local stats
      setStats(prevStats => ({
        ...prevStats,
        pendingRequests: prevStats.pendingRequests - 1
      }));

      setError(null);
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError('Failed to reject request. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin-login');
    } catch (err) {
      setError('Failed to log out');
      console.error('Error logging out:', err);
    }
  };

  const UsersModal = () => (
    <div className="modal-overlay" onClick={() => setShowUsersModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>All Users</h2>
          <button className="close-button" onClick={() => setShowUsersModal(false)}>×</button>
        </div>
        <div className="users-list">
          {allUsers.map(user => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Branch:</strong> {user.branch}</p>
                <p><strong>Year:</strong> {user.year}</p>
                <p><strong>Interest:</strong> {user.interest}</p>
                <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  if (!isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">
          Access denied. You must be an admin to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="header-title">Admin Dashboard</h1>
            {currentUser && (
              <span className="welcome-message">Welcome, {currentUser.email}</span>
            )}
          </div>
          <div className="header-actions">
            {isSuperAdmin && (
              <button className="super-admin-button" onClick={() => navigate('/super-admin')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                Super Admin Panel
              </button>
            )}
            <button className="logout-button" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        <section className="dashboard-stats">
          <h2 className="section-title">Dashboard Overview</h2>
          <div className="stats-container">
            <div className="stat-card clickable" onClick={() => setShowUsersModal(true)}>
              <div className="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalUsers}</span>
                <span className="stat-label">Total Users</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalPosts}</span>
                <span className="stat-label">Total Posts</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalComments}</span>
                <span className="stat-label">Total Comments</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <polyline points="20 8 14 14 20 8"></polyline>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.pendingRequests}</span>
                <span className="stat-label">Pending Requests</span>
              </div>
            </div>
          </div>
        </section>

        <section className="join-requests-section">
          <h2 className="section-title">Join Requests</h2>
          {joinRequests.length === 0 ? (
            <div className="no-requests-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <polyline points="20 8 14 14 20 8"></polyline>
              </svg>
              <p>No pending join requests</p>
            </div>
          ) : (
            <div className="requests-grid">
              {joinRequests.map((request) => (
                <div key={request.id} className="request-card">
                  <div className="request-info">
                    <h3 className="request-name">{request.name}</h3>
                    <div className="request-details">
                      <p><strong>Phone:</strong> {request.phone}</p>
                      <p><strong>Branch:</strong> {request.branch}</p>
                      <p><strong>Year:</strong> {request.year}</p>
                      <p><strong>Interest:</strong> {request.interest}</p>
                      <p><strong>Applied:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button
                      className="approve-button"
                      onClick={() => handleApproveRequest(request.id, request.phone, request)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Approve
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-button" onClick={() => navigate('/admin/posts')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Manage Posts
            </button>
            <button className="action-button" onClick={() => navigate('/admin/comments')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Manage Comments
            </button>
            <button className="action-button" onClick={() => navigate('/admin/users')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Manage Users
            </button>
          </div>
        </section>

        {showUsersModal && <UsersModal />}
      </div>
    </div>
  );
};

export default AdminDashboard; 