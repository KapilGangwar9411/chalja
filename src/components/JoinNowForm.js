import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import '../assets/styles.css';

const JoinNowForm = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: '',
    year: '',
    interest: '',
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

    if (Object.values(formData).some((val) => !val)) {
      setError('All fields are required.');
      return;
    }

    setLoading(true); // Start loading animation

    try {
      await sendEmail(formData);
      setSubmitted(true);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      setIsOpen(false);
    } catch (err) {
      setError('Failed to send email. Please try again later.');
    } finally {
      setLoading(false); // Stop loading animation after submission
    }
  };

  const sendEmail = (data) => {
    return emailjs.send('service_h13jppi', 'template_7u5ytdh', data, '1P52vCXzI5J4jNBZ4');
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
            <h2 className="modal-title">Registration Form❤️</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              {Object.keys(formData).map((key) => (
                <div className="input-group" key={key}>
                  <input 
                    type={key === 'phone' ? 'tel' : 'text'} 
                    name={key} 
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)} 
                    value={formData[key]} 
                    onChange={handleChange} 
                    required 
                    className="input-field"
                    disabled={loading} // Disable input while loading
                  />
                </div>
              ))}
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'} {/* Change text when loading */}
              </button>
            </form>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="full-screen-popup">
          <div className="popup-message">
            <h1>Thanks for Joining Spectrum❤️!</h1>
          </div>
        </div>
      )}

      {/* Minimal Loader */}
      {loading && (
        <div className="loading-overlay">
          <div className="minimal-loader"></div>
        </div>
      )}
    </div>
  );
};

export default JoinNowForm;
