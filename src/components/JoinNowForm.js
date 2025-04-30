import React, { useState, useEffect } from 'react';
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
    interest: [],
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Interest options
  const interestOptions = [
    { value: 'Video Editing', label: 'Video Editing' },
    { value: 'Graphic Designing', label: 'Graphic Designing' },
    { value: 'Cinematography', label: 'Cinematography' },
    { value: 'Photography', label: 'Photography' },
    { value: 'Acting', label: 'Acting' },
    { value: 'Scripting / Screen Writing', label: 'Scripting / Screen Writing' },
    { value: 'Sound Artist', label: 'Sound Artist' },
    { value: 'Anchor', label: 'Anchor' },
    { value: 'Voice Over Artist', label: 'Voice Over Artist' },
    { value: 'Other', label: 'Other' }
  ];

  // Lock scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters long';
        return '';
      case 'phone':
        if (!value) return 'Phone number is required';
        if (!/^[0-9]{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
        return '';
      case 'branch':
        if (!value) return 'Please select your branch';
        return '';
      case 'year':
        if (!value) return 'Please select your year';
        return '';
      case 'interest':
        if (!value || (Array.isArray(value) && value.length === 0)) 
          return 'Please select at least one area of interest';
        return '';
      default:
        return '';
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      newErrors.name = validateField('name', formData.name);
      newErrors.phone = validateField('phone', formData.phone);
    } else if (step === 2) {
      newErrors.branch = validateField('branch', formData.branch);
      newErrors.year = validateField('year', formData.year);
    } else if (step === 3) {
      newErrors.interest = validateField('interest', formData.interest);
    }
    
    // Filter out empty error messages
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== '')
    );
    
    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (key !== 'status' && key !== 'createdAt') {
        const errorMessage = validateField(key, formData[key]);
        if (errorMessage) {
          newErrors[key] = errorMessage;
        }
      }
    });
    
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

  // Handle checkbox changes for interests
  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      // Add the interest
      setFormData({ 
        ...formData, 
        interest: [...formData.interest, value] 
      });
    } else {
      // Remove the interest
      setFormData({ 
        ...formData, 
        interest: formData.interest.filter(item => item !== value) 
      });
    }

    // Clear error when user makes a selection
    if (errors.interest) {
      setErrors({ ...errors, interest: '' });
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
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
        // Convert interest array to comma-separated string for storage
        interest: Array.isArray(formData.interest) ? formData.interest.join(', ') : formData.interest,
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
        interest: [],
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setErrors({});
      setCurrentStep(1);

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
    // Fix: className can be an object in React, not always a string
    const targetClass = e.target.className;
    const isModalOverlay = typeof targetClass === 'string' 
      ? targetClass.includes('modal-overlay') 
      : targetClass && targetClass.contains && targetClass.contains('modal-overlay');
      
    if (isModalOverlay) {
      setIsOpen(false);
    }
  };

  // Get step title
  const getStepTitle = (step) => {
    switch (step) {
      case 1: return 'Personal Details';
      case 2: return 'Academic Information';
      case 3: return 'Interests';
      default: return '';
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="form-group">
              <label htmlFor="name">
                Full Name
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
                Phone Number
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
          </>
        );
      case 2:
        return (
          <>
            <div className="form-group">
              <label htmlFor="branch">
                Branch
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
                Year of Study
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
          </>
        );
      case 3:
        return (
          <>
            <div className="form-group">
              <label>
                Areas of Interest (Select all that apply)
              </label>
              <div className={`checkbox-group ${errors.interest ? 'error' : ''}`}>
                {interestOptions.map((option) => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="interest"
                      value={option.value}
                      checked={formData.interest.includes(option.value)}
                      onChange={handleInterestChange}
                      disabled={loading}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.interest && <span className="error-text">{errors.interest}</span>}
            </div>
            
            <div className="form-summary">
              <h4>Application Summary</h4>
              <div className="summary-item">
                <span>Name</span>
                <span>{formData.name}</span>
              </div>
              <div className="summary-item">
                <span>Phone</span>
                <span>{formData.phone}</span>
              </div>
              <div className="summary-item">
                <span>Branch</span>
                <span>{formData.branch}</span>
              </div>
              <div className="summary-item">
                <span>Year</span>
                <span>{formData.year}</span>
              </div>
              {formData.interest.length > 0 && (
                <div className="summary-item">
                  <span>Interests</span>
                  <span>{formData.interest.join(', ')}</span>
                </div>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Custom CSS for the modal
  const modalStyles = `
    .join-form-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --primary-color: #3d5af1;
      --primary-light: #e6ebff;
      --error-color: #e53935;
      --text-color: #333;
      --text-light: #666;
      --bg-color: #fff;
      --bg-light: #f5f7ff;
      --border-color: #e0e0e0;
      --border-radius: 8px;
      --transition: all 0.2s ease;
      color: var(--text-color);
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 16px;
      transition: opacity 0.25s ease;
    }
    
    .modal-content {
      background-color: var(--bg-color);
      border-radius: var(--border-radius);
      width: 100%;
      max-width: 480px;
      overflow: hidden;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
      transform: translateY(0);
      transition: var(--transition);
      display: flex;
      flex-direction: column;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
    }
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 28px;
      background: linear-gradient(120deg, #3d5af1, #2a41c5);
      position: relative;
      overflow: hidden;
      border-radius: 10px;
    }
    
    .modal-header::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
      opacity: 0.3;
      z-index: 0;
    }
    
    .modal-title {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 600;
      color: white;
      position: relative;
      z-index: 1;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
    }
    
    .modal-title::before {
      content: "";
      display: inline-block;
      width: 24px;
      height: 24px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='9' cy='7' r='4'%3E%3C/circle%3E%3Cpath d='M22 21v-2a4 4 0 0 0-3-3.87'%3E%3C/path%3E%3Cpath d='M16 3.13a4 4 0 0 1 0 7.75'%3E%3C/path%3E%3C/svg%3E");
      margin-right: 10px;
    }
    
    .close-button {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      color: white;
      height: 32px;
      width: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
      position: relative;
      z-index: 1;
      backdrop-filter: blur(2px);
    }
    
    .close-button:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
    }
    
    .form-body {
      padding: 24px;
      overflow-y: auto;
      max-height: 70vh;
    }
    
    .form-step-header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .step-indicator-bar {
      display: flex;
      width: 100%;
      height: 4px;
      background-color: var(--border-color);
      position: relative;
      border-radius: 2px;
      overflow: hidden;
      margin-top: 4px;
    }
    
    .step-progress {
      position: absolute;
      height: 100%;
      background-color: var(--primary-color);
      transition: width 0.3s ease;
    }
    
    .step-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 4px 0;
    }
    
    .step-subtitle {
      font-size: 0.875rem;
      color: var(--text-light);
      margin: 0;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--text-color);
    }
    
    .input-field {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      font-size: 0.95rem;
      transition: var(--transition);
      background-color: var(--bg-color);
      color: var(--text-color);
    }
    
    .input-field:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--primary-light);
    }
    
    .input-field.error {
      border-color: var(--error-color);
      background-color: rgba(229, 57, 53, 0.03);
    }
    
    .input-field::placeholder {
      color: #999;
    }
    
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      background-color: var(--bg-color);
    }
    
    .checkbox-group.error {
      border-color: var(--error-color);
      background-color: rgba(229, 57, 53, 0.03);
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      cursor: pointer;
      user-select: none;
    }
    
    .checkbox-label input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: white;
      cursor: pointer;
      position: relative;
      transition: var(--transition);
    }
    
    .checkbox-label input[type="checkbox"]:checked {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
    
    .checkbox-label input[type="checkbox"]:checked::after {
      content: '';
      position: absolute;
      top: 4px;
      left: 6px;
      width: 6px;
      height: 9px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    .checkbox-label:hover input[type="checkbox"]:not(:checked) {
      border-color: var(--primary-color);
    }
    
    .error-text {
      display: block;
      color: var(--error-color);
      font-size: 0.75rem;
      margin-top: 6px;
    }
    
    .error-message {
      background-color: rgba(229, 57, 53, 0.05);
      color: var(--error-color);
      padding: 10px 14px;
      border-radius: var(--border-radius);
      margin-bottom: 20px;
      font-size: 0.875rem;
      border-left: 3px solid var(--error-color);
    }
    
    .form-nav-buttons {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 32px;
    }
    
    .back-button {
      padding: 9px 16px;
      border: 1px solid var(--border-color);
      background-color: transparent;
      color: var(--text-color);
      border-radius: var(--border-radius);
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: var(--transition);
    }
    
    .back-button:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .next-button, .submit-button {
      padding: 10px 20px;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: var(--border-radius);
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: var(--transition);
      min-width: 100px;
      text-align: center;
    }
    
    .next-button:hover, .submit-button:hover {
      background-color: #2a46e0;
    }
    
    .next-button:disabled, .submit-button:disabled {
      background-color: #c5c5c5;
      cursor: not-allowed;
    }
    
    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .form-summary {
      background-color: var(--bg-light);
      border-radius: var(--border-radius);
      padding: 16px;
      margin-top: 24px;
    }
    
    .form-summary h4 {
      margin: 0 0 12px 0;
      font-size: 0.95rem;
      color: var(--text-color);
      font-weight: 600;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      font-size: 0.875rem;
    }
    
    .summary-item:last-child {
      border-bottom: none;
    }
    
    .summary-item span:first-child {
      font-weight: 500;
      color: var(--text-light);
    }
    
    .summary-item span:last-child {
      font-weight: 500;
      color: var(--text-color);
    }
    
    .full-screen-popup {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.95);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }
    
    .popup-message {
      background-color: white;
      padding: 32px;
      border-radius: var(--border-radius);
      text-align: center;
      max-width: 90%;
      width: 440px;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
      animation: slideUp 0.4s ease;
    }
    
    .popup-message svg {
      color: #4CAF50;
      margin-bottom: 16px;
      width: 48px;
      height: 48px;
    }
    
    .popup-message h1 {
      margin: 0 0 8px 0;
      color: var(--text-color);
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .popup-message p {
      margin: 0;
      color: var(--text-light);
      font-size: 0.95rem;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Mobile responsiveness */
    @media (max-width: 480px) {
      .modal-content {
        max-width: 100%;
        height: 100%;
        border-radius: 0;
        max-height: 100vh;
      }
      
      .form-body {
        flex: 1;
        padding: 20px 16px;
        max-height: calc(100vh - 60px);
      }
      
      .modal-header {
        padding: 16px;
      }
      
      .popup-message {
        padding: 24px;
        width: 100%;
        max-width: calc(100% - 32px);
      }
      
      .form-nav-buttons {
        margin-top: auto;
        padding-top: 20px;
      }
      
      .checkbox-group {
        padding: 8px;
      }
    }
    
    /* Tablet responsiveness */
    @media (min-width: 481px) and (max-width: 768px) {
      .modal-content {
        max-width: 90%;
      }
    }
  `;

  // Get progress percentage based on current step
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="join-form-container">
      <style>{modalStyles}</style>
      
      {isOpen && (
        <div className="modal-overlay" onClick={handleModalClick}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Join Spectrum</h2>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="form-body">
              {errors.submit && <div className="error-message">{errors.submit}</div>}
              
              <div className="form-step-header">
                <div style={{ width: '100%' }}>
                  <div className="step-title">{getStepTitle(currentStep)}</div>
                  <div className="step-subtitle">Step {currentStep} of {totalSteps}</div>
                  <div className="step-indicator-bar">
                    <div className="step-progress" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="join-form">
                {renderStepContent()}
                <div className="form-nav-buttons">
                  {currentStep > 1 && (
                    <button 
                      type="button" 
                      className="back-button" 
                      onClick={handleBack}
                      disabled={loading}
                    >
                      Back
                    </button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <button 
                      type="button" 
                      className="next-button" 
                      onClick={handleNext}
                      disabled={loading}
                    >
                      Continue
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="submit-button" 
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="button-content">
                          <Loader size="small" />
                          Submitting...
                        </span>
                      ) : (
                        'Submit'
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
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
            <h1>Application Submitted</h1>
            <p>We'll review your application and get back to you soon.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinNowForm;
