import React from 'react';
import '../assets/styles.css';

const teamMembers = [
  {
    name: 'Miss. Anuradha Singh',
    title: 'Faculty Coordinator',
    image: '/images/faculty.jpg',
    instagram: '#',
    linkedin: 'https://in.linkedin.com/in/anuradha-singh-9a65ba244', 
    isFaculty: true
  },
  {
    name: 'Hardik Ojha',
    title: 'Vice President',
    image: '/images/hardik.jpg',
    instagram: 'https://www.instagram.com/hardik_ojha_?igsh=dDQ3eHFxemhhdTd1&utm_source=qr',
    linkedin: 'https://www.linkedin.com/in/hardik-ojha-96328b304',
  },
  {
    name: 'Ayush Shukla',
    title: 'President',
    image: '/images/shukla.jpg',
    instagram: 'https://www.instagram.com/ayush_shukla09?igsh=MnRrNmdsOXQzMnUxr',
    linkedin: 'https://www.linkedin.com/in/ayush-shukla-20b755250s',
  },
  {
    name: 'Kapil Gangwar',
    title: 'Vice President',
    image: '/images/kapil.jpg',
    instagram: 'https://www.instagram.com/brandup.creatives/?igsh=Y3hoZ3Q1dGU3eGt6',
    linkedin: 'https://www.linkedin.com/in/kapil-gangwar-1bbb40251',
  },
];

const supportTeamMembers = [
  {
    name: 'Alok Kumar',
    title: 'Technical Head',
    image: '/images/alok.jpg',
  },
  {
    name: 'Saksham Patel',
    title: 'Production Manager',
    image: '/images/saksham.jpg',
  },
  {
    name: 'Aditya Yadav',
    title: 'Cinematographer',
    image: '/images/aditya.jpg',
  },
  {
    name: 'Arya Anand',
    title: 'Graphic Designer',
    image: '/images/arya.jpg',
  },
  {
    name: 'Shivani Rai',
    title: 'Content Director',
    image: '/images/shivani.jpg',
  },  
];

const TeamSection = () => {
  return (
    <section className="team-section" id="team">
      <h2 className="team-title">Meet Our Team</h2>
      
      {/* Core Team Members */}
      <div className="team-container">
        {teamMembers.map((member, index) => (
          <div className={`team-member ${member.isFaculty ? 'faculty-member' : ''}`} key={index}>
            <div className="member-photo" style={{ backgroundImage: `url(${member.image})` }}>
              <div className="photo-overlay"></div>
            </div>
            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <p className="member-title">{member.title}</p>
              {member.isFaculty && (
                <div className="faculty-details">
                  <p className="faculty-department">Department of Computer Science</p>
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="faculty-linkedin"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              <div className="social-icons">
                {member.instagram !== '#' && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    Instagram
                  </a>
                )}
                {member.linkedin !== '#' && !member.isFaculty && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Support Team Section */}
      <h3 className="support-team-title">Coordinators</h3>
      <div className="support-team-container">
        {supportTeamMembers.map((member, index) => (
          <div className="support-team-member" key={index}>
            <div className="support-member-photo" style={{ backgroundImage: `url(${member.image})` }}>
              <div className="support-photo-overlay"></div>
            </div>
            <div className="support-member-info">
              <h4 className="support-member-name">{member.name}</h4>
              <p className="support-member-title">{member.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
