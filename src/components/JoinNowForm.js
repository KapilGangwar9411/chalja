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
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // Branch validation
    if (!formData.branch) {
      newErrors.branch = 'Please select your branch';
    }

    // Year validation
    if (!formData.year) {
      newErrors.year = 'Please select your year';
    }

    // Interest validation
    if (!formData.interest) {
      newErrors.interest = 'Please select your area of interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits and max 10 characters
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: digits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      const joinRequestsRef = ref(database, 'joinRequests');
      const newRequestRef = await push(joinRequestsRef, submitData);

      if (!newRequestRef.key) {
        throw new Error('Failed to generate request ID');
      }

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
      setErrors({});

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
      
      setErrors({ submit: errorMessage });
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
            
            {errors.submit && <div className="error-message">{errors.submit}</div>}
            
            <form onSubmit={handleSubmit} className="join-form">
              <div className="form-group">
                <label htmlFor="name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`input-field ${errors.name ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your 10-digit phone number"
                  className={`input-field ${errors.phone ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="branch">
                  Branch <span className="required">*</span>
                </label>
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className={`input-field ${errors.branch ? 'error' : ''}`}
                  disabled={loading}
                >
                  <option value="">Select your branch</option>
                  <option value="CSE">Computer Science and Engineering</option>
                  <option value="ECE">Electronics and Communication Engineering</option>
                  <option value="ME">Mechanical Engineering</option>
                  <option value="CE">Civil Engineering</option>
                  <option value="EE">Electrical Engineering</option>
                  <option value="IT">Information Technology</option>
                  <option value="DS">Data Science</option>
                  <option value="AI">Artificial Intelligence</option>
                  <option value="IOT">Internet of Things</option>
                  <option value="Other">Other</option>
                </select>
                {errors.branch && <span className="error-text">{errors.branch}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="year">
                  Year of Study <span className="required">*</span>
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`input-field ${errors.year ? 'error' : ''}`}
                  disabled={loading}
                >
                  <option value="">Select your year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                </select>
                {errors.year && <span className="error-text">{errors.year}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="interest">
                  Area of Interest <span className="required">*</span>
                </label>
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className={`input-field ${errors.interest ? 'error' : ''}`}
                  disabled={loading}
                >
                  <option value="">Select your interest</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Graphic Designing">Graphic Designing</option>
                  <option value="Film Making">Film Making</option>
                  <option value="Cinematography">Cinematography</option>
                  <option value="Photography">Photography</option>
                  <option value="Other">Other</option>
                </select>
                {errors.interest && <span className="error-text">{errors.interest}</span>}
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
