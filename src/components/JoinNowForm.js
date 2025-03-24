import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';
import '../assets/styles.css';
import Loader from './Loader';

const JoinNowForm = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: '',
    year: '',
    interest: '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields are filled
    if (Object.values(formData).some((val) => !val)) {
      setError('All fields are required.');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    try {
      // Create a clean data object
      const submitData = {
        ...formData,
        createdAt: new Date().toISOString(),
      };

      // Save to Firebase
      const joinRequestsRef = ref(database, 'joinRequests');
      const newRequestRef = await push(joinRequestsRef, submitData);

      if (!newRequestRef.key) {
        throw new Error('Failed to generate request ID');
      }

      console.log('Form submitted successfully with ID:', newRequestRef.key);
      setSubmitted(true);
      setShowPopup(true);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        branch: '',
        year: '',
        interest: '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      // Close modal after delay
      setTimeout(() => {
        setShowPopup(false);
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      console.error('Detailed error:', err);
      let errorMessage = 'Failed to submit form. Please try again later.';
      
      if (err.code === 'PERMISSION_DENIED') {
        errorMessage = 'Access denied. Please contact support.';
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.code === 'UNKNOWN') {
        errorMessage = 'An unexpected error occurred. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClick = (e) => {
    if (e.target.className === 'modal') {
      setIsOpen(false);
    }
  };

  return (
    <div className="form-container">
      {isOpen && (
        <div className="modal" onClick={handleModalClick}>
          <div className="modal-content glass-effect animate-popup">
            <div className="modal-header">
              <h2 className="modal-title">Join Spectrum</h2>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="join-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="input-field"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your 10-digit phone number"
                  required
                  className="input-field"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="branch">Branch</label>
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  className="input-field"
                  disabled={loading}
                >
                  <option value="">Select your branch</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="ME">Mechanical</option>
                  <option value="CE">Civil</option>
                  <option value="EE">Electrical</option>
                  <option value="IT">Information Technology</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="year">Year of Study</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="input-field"
                  disabled={loading}
                >
                  <option value="">Select your year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="interest">Area of Interest</label>
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  required
                  className="input-field"
                  disabled={loading}
                >
                  <option value="">Select your interest</option>
                  <option value="Web Development">Web Development</option>
                  <option value="App Development">App Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Competitive Programming">Competitive Programming</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <span className="button-content">
                    <Loader size="small" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="full-screen-popup">
          <div className="popup-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h1>Application Submitted Successfully!</h1>
            <p>We'll review your application and get back to you soon.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinNowForm;
