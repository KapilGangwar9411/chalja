import React, { useState } from 'react';
import './filmSubmissionModal.css';

const FilmSubmissionModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    section: '',
    year: '',
    phone: '',
    instaHandle: '',
    film: null,
    thumbnail: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.files[0] // Store the uploaded file
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send formData to server (use fetch or axios)
    console.log('Form submitted: ', formData);
    alert('Your film has been submitted!');
    onClose(); // Close the modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Submit Your Film</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Filmmaker's Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="section"
            placeholder="Section"
            value={formData.section}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="instaHandle"
            placeholder="Instagram Handle"
            value={formData.instaHandle}
            onChange={handleInputChange}
          />
          <label>Upload Film:</label>
          <input
            type="file"
            name="film"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
          <label>Upload Thumbnail:</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <button type="submit" className="submit-film-btn">Submit</button>
          <button type="button" className="close-btn" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default FilmSubmissionModal;
