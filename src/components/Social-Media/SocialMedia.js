import React from 'react';
import './SocialMedia.css'; // Import your CSS file

const SocialMedia = () => {
  const socialMediaLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/niet_spectrum_club?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      icon: 'icons/instagram.svg', // Path to your Instagram icon
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com',
      icon: 'icons/linkedin.svg', // Path to your LinkedIn icon
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com',
      icon: 'icons/youtube.svg', // Path to your YouTube icon
    },
  ];

  return (
    <div className="social-media-container">
      <h1 className="title2">Connect with Us!</h1>
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
              <img src={`${process.env.PUBLIC_URL}/${social.icon}`} alt={social.name} />
            </div>
            <span className="icon-name">{social.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
