import React from 'react';
import '../assets/styles.css';

const teamMembers = [
  {
    name: 'Hardik Ojha',
    title: 'Vice President',
    image: '/images/hardik.jpg',
    instagram: 'https://www.instagram.com/hardikojha', // Replace with actual URL
    linkedin: 'https://www.linkedin.com/in/hardikojha', // Replace with actual URL
  },
  {
    name: 'Ayush Shukla',
    title: 'President',
    image: '/images/shukla.jpg',
    instagram: 'https://www.instagram.com/ayushshukla', // Replace with actual URL
    linkedin: 'https://www.linkedin.com/in/ayushshukla', // Replace with actual URL
  },
  {
    name: 'Kapil Gangwar',
    title: 'Vice President',
    image: '/images/image1.png',
    instagram: 'https://www.instagram.com/brandup.creatives/?igsh=Y3hoZ3Q1dGU3eGt6', // Replace with actual URL
    linkedin: 'https://www.linkedin.com/in/kapil-gangwar-1bbb40251', // Replace with actual URL
  },
];

const TeamSection = () => {
  return (
    <section className="team-section" id="team">
      <h2 className="team-title">Meet Our Team</h2>
      <div className="team-container">
        {teamMembers.map((member, index) => (
          <div className="team-member" key={index}>
            <div className="member-photo" style={{ backgroundImage: `url(${member.image})` }}>
              <div className="photo-overlay"></div>
            </div>
            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <p className="member-title">{member.title}</p>
              <div className="social-icons">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  Instagram
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
