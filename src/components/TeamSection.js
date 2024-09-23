import React from 'react';
import '../assets/styles.css';


const teamMembers = [
  { name: 'Hardik Ojha', title: 'Vice President', image: '/images/hardik.jpg'  },
  { name: 'Ayush Shukla', title: 'President', image: '/images/shukla.jpg' },
  { name: 'Kapil Gangwar', title: 'Vice President', image: '/images/image1.png' },
];

const TeamSection = () => {
  return (
    <section className="team-section">
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
