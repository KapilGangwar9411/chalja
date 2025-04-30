import React, { useState } from 'react';
import './filmSubmissionModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faFilm, faImage, faUser, faPhoneAlt, faHashtag, faSchool } from '@fortawesome/free-solid-svg-icons';

const FilmSubmissionModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    section: '',
    year: '',
    phone: '',
    instaHandle: '',
    filmTitle: '',
    filmDescription: '',
    film: null,
    thumbnail: null
  });
  
  const [filmPreview, setFilmPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (files && files[0]) {
    setFormData({
      ...formData,
        [name]: files[0]
      });
      
      // Create preview URLs for the uploaded files
      if (name === 'film') {
        setFilmPreview(URL.createObjectURL(files[0]));
      } else if (name === 'thumbnail') {
        setThumbnailPreview(URL.createObjectURL(files[0]));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
    console.log('Form submitted: ', formData);
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepOne = () => (
    <div className="form-step">
      <h3 className="step-title">Filmmaker Information</h3>
      <p className="step-description">Tell us about yourself - the creative mind behind the film.</p>
      
      <div className="input-group">
        <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input
            type="text"
            name="name"
          placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
      </div>
      
      <div className="input-row">
        <div className="input-group">
          <FontAwesomeIcon icon={faSchool} className="input-icon" />
          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="input-group">
          <FontAwesomeIcon icon={faSchool} className="input-icon" />
          <input
            type="text"
            name="section"
            placeholder="Section"
            value={formData.section}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      
      <div className="input-row">
        <div className="input-group">
          <FontAwesomeIcon icon={faSchool} className="input-icon" />
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="input-group">
          <FontAwesomeIcon icon={faPhoneAlt} className="input-icon" />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      
      <div className="input-group">
        <FontAwesomeIcon icon={faHashtag} className="input-icon" />
          <input
            type="text"
            name="instaHandle"
          placeholder="Instagram Handle (optional)"
            value={formData.instaHandle}
            onChange={handleInputChange}
          />
      </div>
      
      <div className="form-buttons">
        <button type="button" className="next-btn" onClick={nextStep}>Next</button>
        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="form-step">
      <h3 className="step-title">Film Details</h3>
      <p className="step-description">Share information about your film creation.</p>
      
      <div className="input-group">
        <FontAwesomeIcon icon={faFilm} className="input-icon" />
        <input
          type="text"
          name="filmTitle"
          placeholder="Film Title"
          value={formData.filmTitle}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="input-group textarea-group">
        <textarea
          name="filmDescription"
          placeholder="Brief description of your film..."
          value={formData.filmDescription}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="file-upload-container">
        <div className="file-upload">
          <label className="file-upload-label">
            <FontAwesomeIcon icon={faFilm} className="upload-icon" />
            <span>Upload Film</span>
          <input
            type="file"
            name="film"
            accept="video/*"
            onChange={handleFileChange}
            required
              className="file-input"
          />
          </label>
          {formData.film && (
            <div className="file-info">
              <span>{formData.film.name}</span>
              {filmPreview && (
                <video 
                  className="file-preview" 
                  src={filmPreview} 
                  controls 
                />
              )}
            </div>
          )}
        </div>
        
        <div className="file-upload">
          <label className="file-upload-label">
            <FontAwesomeIcon icon={faImage} className="upload-icon" />
            <span>Upload Thumbnail</span>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            required
              className="file-input"
          />
          </label>
          {formData.thumbnail && (
            <div className="file-info">
              <span>{formData.thumbnail.name}</span>
              {thumbnailPreview && (
                <img 
                  className="file-preview" 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                />
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="form-buttons">
        <button type="button" className="back-btn" onClick={prevStep}>Back</button>
        <button 
          type="submit" 
          className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Film'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="submission-modal">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <h2>Submit Your Film</h2>
          <div className="steps-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStepOne()}
          {currentStep === 2 && renderStepTwo()}
        </form>
      </div>
    </div>
  );
};

export default FilmSubmissionModal;
