import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebase';
import { signOut } from 'firebase/auth';
import { ref, get, update, remove, push, onValue } from 'firebase/database';
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
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const categories = [
    { value: 'Workshop', label: 'Workshop', icon: '🛠️' },
    { value: 'Entertainment', label: 'Entertainment', icon: '🎭' },
    { value: 'Competition', label: 'Competition', icon: '🏆' },
    { value: 'Photography', label: 'Photography', icon: '📸' },
    { value: 'Social', label: 'Social', icon: '🤝' }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
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

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const eventsData = snapshot.val();
        const eventsArray = Object.entries(eventsData).map(([id, data]) => {
          // Format the date and time for display
          const eventDate = new Date(data.date);
          const now = new Date();
          
          return {
            id,
            ...data,
            formattedDate: eventDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            formattedTime: data.time,
            status: eventDate >= now ? 'upcoming' : 'past',
            participants: data.participants || 0,
            registrations: data.registrations || [],
            availableSeats: data.seats - (data.participants || 0)
          };
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setEvents(eventsArray);
      } else {
        setEvents([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchStats = async () => {
    try {
      const usersRef = ref(database, 'users');
      onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const allUsersList = Object.entries(usersData)
            .map(([id, data]) => ({
              id,
              ...data
            }));
          setAllUsers(allUsersList);
          setStats(prevStats => ({
            ...prevStats,
            totalUsers: allUsersList.length
          }));
        } else {
          setAllUsers([]);
          setStats(prevStats => ({
            ...prevStats,
            totalUsers: 0
          }));
        }
      });

      const postsRef = ref(database, 'posts');
      const commentsRef = ref(database, 'comments');
      const joinRequestsRef = ref(database, 'joinRequests');
      
      const [postsSnapshot, commentsSnapshot, requestsSnapshot] = await Promise.all([
        get(postsRef),
        get(commentsRef),
        get(joinRequestsRef)
      ]);

      const pendingRequests = requestsSnapshot.exists() 
        ? Object.values(requestsSnapshot.val())
          .filter(request => request.status === 'pending' || !request.status).length 
        : 0;

      setStats(prevStats => ({
        ...prevStats,
        totalPosts: postsSnapshot.exists() ? Object.keys(postsSnapshot.val()).length : 0,
        totalComments: commentsSnapshot.exists() ? Object.keys(commentsSnapshot.val()).length : 0,
        pendingRequests
      }));
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
          .filter(request => request.status === 'pending' || !request.status)
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
      setLoading(true);

      const requestRef = ref(database, `joinRequests/${requestId}`);
      await update(requestRef, {
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: currentUser.uid
      });

      // Create user data object
      const userData = {
        name: requestData.name,
        phone: requestData.phone,
        branch: requestData.branch,
        year: requestData.year,
        interest: requestData.interest,
        email: `${requestData.phone}@spectrum.com`,
        isAdmin: false,
        isSuperAdmin: false,
        isApproved: true,
        createdAt: new Date().toISOString(),
        joinRequestId: requestId,
        approvedAt: new Date().toISOString(),
        approvedBy: currentUser.uid
      };

      // Push user data to database
      await push(ref(database, 'users'), userData);

      const whatsappGroupLink = "https://chat.whatsapp.com/K64zrdrxJwY9Y1Bnrf46nd";
      
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      const whatsappPhone = formattedPhone.startsWith('91') ? formattedPhone : `91${formattedPhone}`;
      
      const whatsappMessage = `Welcome to Spectrum, ${requestData.name}! 🎉\n\n` +
        `Your application has been approved. Please join our WhatsApp group using this link:\n` +
        `${whatsappGroupLink}\n\n` +
        `We're excited to have you as part of Spectrum!`;

      const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      setStats(prevStats => ({
        ...prevStats,
        totalUsers: prevStats.totalUsers + 1,
        pendingRequests: prevStats.pendingRequests - 1
      }));

      setJoinRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );

      setError(null);
    } catch (err) {
      console.error('Error approving request:', err);
      setError('Failed to approve request. Please try again.');
    } finally {
      setLoading(false);
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

  const handleDeleteEvent = async (eventId) => {
    try {
      const eventRef = ref(database, `events/${eventId}`);
      await remove(eventRef);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    }
  };

  const EventsModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      category: '',
      image: '',
      registrationFee: '',
      seats: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const imgbbApiKey = 'a76462040ea5f041b5e64d5821588810';

    const handleChange = (e) => {
      const { id, value } = e.target;
      const fieldName = id.replace('event', '').toLowerCase();
      
      if (fieldName === 'registrationfee') {
        if (value === '') {
          setFormData(prev => ({ ...prev, registrationFee: '' }));
          return;
        }
        
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 0) {
          setFormData(prev => ({ ...prev, registrationFee: value }));
        }
        return;
      }

      if (fieldName === 'image') {
        setImagePreview(value);
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));

      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: ''
        }));
      }
    };

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please upload a valid image file (JPEG, PNG, GIF, or WEBP)'
        }));
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 2MB'
        }));
        return;
      }

      setIsUploading(true);
      setErrors(prev => ({ ...prev, image: '' }));

      try {
        // Create FormData
        const formData = new FormData();
        formData.append('image', file);

        // Upload to ImgBB
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          setFormData(prev => ({ ...prev, image: data.data.url }));
          setImagePreview(data.data.url);
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrors(prev => ({
          ...prev,
          image: 'Failed to upload image. Please try again.'
        }));
      } finally {
        setIsUploading(false);
      }
    };

    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.title.trim()) newErrors.title = 'Please enter an event title';
      if (!formData.description.trim()) newErrors.description = 'Please provide a description';
      if (!formData.date) newErrors.date = 'Please select an event date';
      if (!formData.time) newErrors.time = 'Please select an event time';
      if (!formData.venue.trim()) newErrors.venue = 'Please specify the venue';
      if (!formData.category) newErrors.category = 'Please select a category';
      if (!formData.image.trim()) newErrors.image = 'Please provide an image URL';
      if (!formData.seats || formData.seats < 1) newErrors.seats = 'Please enter a valid number of seats';

      if (formData.registrationFee === '') {
        newErrors.registrationFee = 'Please enter the registration fee (0 for free events)';
      } else {
        const fee = Number(formData.registrationFee);
        if (isNaN(fee) || fee < 0) {
          newErrors.registrationFee = 'Please enter a valid amount (0 or more)';
        }
      }

      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }

      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i;
      if (formData.image && !urlPattern.test(formData.image)) {
        newErrors.image = 'Please enter a valid image URL';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;

      setIsSubmitting(true);
      try {
        if (!currentUser) {
          throw new Error('You must be logged in to perform this action');
        }

        const userRef = ref(database, `users/${currentUser.uid}`);
        const userSnapshot = await get(userRef);
        
        if (!userSnapshot.exists() || (!userSnapshot.val().isAdmin && !userSnapshot.val().isSuperAdmin)) {
          throw new Error('You do not have permission to perform this action');
        }

        const eventsRef = ref(database, 'events');
        const eventData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          date: formData.date,
          time: formData.time,
          venue: formData.venue.trim(),
          category: formData.category,
          image: formData.image.trim(),
          registrationFee: Number(formData.registrationFee),
          seats: Number(formData.seats),
          createdAt: new Date().toISOString(),
          createdBy: currentUser.uid,
          participants: 0,
          status: 'upcoming',
          registrations: {}
        };

        // Validate all required fields are present and of correct type
        const requiredFields = [
          'title', 'description', 'date', 'time', 'venue', 
          'category', 'image', 'registrationFee', 'seats'
        ];

        const missingFields = requiredFields.filter(field => !eventData[field]);
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        await push(eventsRef, eventData);
        setShowEventsModal(false);
        
        // Clear form data after successful submission
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          venue: '',
          category: '',
          image: '',
          registrationFee: '',
          seats: ''
        });
        setImagePreview('');
      } catch (error) {
        console.error('Error adding event:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Failed to add event. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowEventsModal(false)}>
        <div className="modal-content event-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div className="header-content">
              <h2>Create New Event</h2>
              <p className="header-subtitle">Fill in the details to create your event</p>
            </div>
            <button 
              className="close-button" 
              onClick={() => setShowEventsModal(false)}
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="modal-tabs">
            <button 
              className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              Basic Info
            </button>
            <button 
              className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Event Details
            </button>
            <button 
              className={`tab-button ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              Pricing & Seats
            </button>
          </div>

          <form onSubmit={handleSubmit} className="event-form">
            {activeTab === 'basic' && (
              <div className="form-section">
                <div className="form-group full-width">
                  <label htmlFor="eventTitle">Event Title *</label>
                  <input
                    id="eventTitle"
                    type="text"
                    placeholder="Enter a descriptive title"
                    value={formData.title}
                    onChange={handleChange}
                    className={errors.title ? 'error' : ''}
                  />
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="eventCategory">Category *</label>
                  <select
                    id="eventCategory"
                    value={formData.category}
                    onChange={handleChange}
                    className={errors.category ? 'error' : ''}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="error-message">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="eventImage">Event Image *</label>
                  <div className="image-upload-container">
                    <div className="image-input-group">
                      <input
                        id="eventImage"
                        type="url"
                        placeholder="Image URL will appear here"
                        value={formData.image}
                        onChange={handleChange}
                        className={errors.image ? 'error' : ''}
                        readOnly
                      />
                      <div className="upload-button-wrapper">
                        <input
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                        <label htmlFor="imageUpload" className={`upload-button ${isUploading ? 'uploading' : ''}`}>
                          {isUploading ? (
                            <>
                              <svg className="spinner" viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                              </svg>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                              </svg>
                              Upload Image
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                    {errors.image && <span className="error-message">{errors.image}</span>}
                    {formData.image && (
                      <div className="image-preview">
                        <img 
                          src={imagePreview} 
                          alt="Event preview"
                          onError={() => setImagePreview('')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="form-section">
                <div className="form-group full-width">
                  <label htmlFor="eventDescription">Description *</label>
                  <textarea
                    id="eventDescription"
                    placeholder="Provide a detailed description of the event"
                    value={formData.description}
                    onChange={handleChange}
                    className={errors.description ? 'error' : ''}
                    rows="4"
                  ></textarea>
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="eventDate">Event Date *</label>
                  <input
                    id="eventDate"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={errors.date ? 'error' : ''}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.date && <span className="error-message">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="eventTime">Event Time *</label>
                  <input
                    id="eventTime"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={errors.time ? 'error' : ''}
                  />
                  {errors.time && <span className="error-message">{errors.time}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="eventVenue">Venue *</label>
                  <input
                    id="eventVenue"
                    type="text"
                    placeholder="Event location"
                    value={formData.venue}
                    onChange={handleChange}
                    className={errors.venue ? 'error' : ''}
                  />
                  {errors.venue && <span className="error-message">{errors.venue}</span>}
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="eventRegistrationFee">Registration Fee *</label>
                  <div className="fee-input-group">
                    <span className="currency-symbol">₹</span>
                    <input
                      id="eventRegistrationFee"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={formData.registrationFee}
                      onChange={handleChange}
                      className={errors.registrationFee ? 'error' : ''}
                    />
                  </div>
                  {errors.registrationFee && <span className="error-message">{errors.registrationFee}</span>}
                  <span className="helper-text">Enter 0 for free events</span>
                </div>

                <div className="form-group">
                  <label htmlFor="eventSeats">Available Seats *</label>
                  <input
                    id="eventSeats"
                    type="number"
                    min="1"
                    placeholder="Number of seats"
                    value={formData.seats}
                    onChange={handleChange}
                    className={errors.seats ? 'error' : ''}
                  />
                  {errors.seats && <span className="error-message">{errors.seats}</span>}
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="form-error-message">
                {errors.submit}
              </div>
            )}

            <div className="form-actions">
              <div className="tab-navigation">
                {activeTab !== 'basic' && (
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setActiveTab(activeTab === 'pricing' ? 'details' : 'basic')}
                  >
                    Previous
                  </button>
                )}
              </div>
              <div className="action-buttons">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowEventsModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                {activeTab === 'pricing' ? (
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Event'}
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => setActiveTab(activeTab === 'basic' ? 'details' : 'pricing')}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const UsersModal = () => (
    <div className="modal-overlay" onClick={() => setShowUsersModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>All Users</h2>
          <button className="close-button" onClick={() => setShowUsersModal(false)}>×</button>
        </div>
        <div className="users-list">
          {allUsers.length === 0 ? (
            <div className="no-data">No users found</div>
          ) : (
            allUsers.map(user => (
              <div key={user.id} className="user-item">
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Branch:</strong> {user.branch}</p>
                  <p><strong>Year:</strong> {user.year}</p>
                  <p><strong>Interest:</strong> {user.interest}</p>
                  <p><strong>Status:</strong> <span className={`status-badge ${user.isApproved ? 'approved' : 'pending'}`}>
                    {user.isApproved ? 'Approved' : 'Pending'}
                  </span></p>
                  <p><strong>Role:</strong> <span className={`role-badge ${user.isSuperAdmin ? 'super-admin' : user.isAdmin ? 'admin' : 'user'}`}>
                    {user.isSuperAdmin ? 'Super Admin' : user.isAdmin ? 'Admin' : 'User'}
                  </span></p>
                  <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                  {user.approvedAt && (
                    <p><strong>Approved On:</strong> {new Date(user.approvedAt).toLocaleDateString()}</p>
                  )}
                  {user.approvedBy && (
                    <p><strong>Approved By:</strong> {user.approvedBy}</p>
                  )}
                </div>
              </div>
            ))
          )}
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
              <button className="super-admin-button" onClick={() => navigate('/admin-login')}>
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

        <section className="events-management-section">
          <h2 className="section-title">Events Management</h2>
          <div className="section-header">
            <button className="add-event-button" onClick={() => setShowEventsModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Add New Event
            </button>
          </div>
          <div className="events-grid">
            {events.length === 0 ? (
              <div className="no-events-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <p>No events added yet</p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      onError={(e) => {
                        e.target.src = '/images/default-event.png';
                      }}
                    />
                    <span className="event-category">
                      {categories.find(cat => cat.value === event.category)?.icon || ''} {event.category}
                    </span>
                  </div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-details">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {event.formattedDate}
                      </span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {event.formattedTime}
                      </span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {event.venue}
                      </span>
                    </div>
                    <div className="event-stats">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        {event.registrationFee === 0 ? 'Free' : `₹${event.registrationFee}`}
                      </span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        {event.availableSeats} seats available
                      </span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        {event.participants} registered
                      </span>
                    </div>
                    <div className="event-actions">
        <button 
                        className="delete-button"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
        </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {showEventsModal && <EventsModal />}
        </section>

        {showUsersModal && <UsersModal />}
      </div>
    </div>
  );
};

export default AdminDashboard; 