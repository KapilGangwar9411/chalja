import React from 'react';
import './SocialMedia.css'; // Import your CSS file

const SocialMedia = () => {
  const socialMediaLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com',
      icon: '📸',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com',
      icon: '💼',
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com',
      icon: '📺',
    },
  ];

  return (
    <div className="social-media-container">
      <h1 className="title">Connect with Us</h1>
      <div className="social-icons">
        {socialMediaLinks.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <div className="icon">
              {social.icon}
            </div>
            <span className="icon-name">{social.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
