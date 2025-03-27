import React, { useState, useEffect } from 'react';
import './VideoEditing.css';
import '../../assets/styles.css';
import Footer from '../Footer';
import Loader from '../Loader';
import SEOHead from '../SEO/SEOHead';
import { Link } from 'react-router-dom';

const VideoEditing = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const portfolioSchemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Design & Motion Graphics Portfolio - Thasya Ushsholikhah",
    "description": "Design and motion graphics portfolio showcasing creative works by Thasya Ushsholikhah",
    "url": "https://spectrumclub.vercel.app/portfolio",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "CreativeWork",
          "name": "Brand Identity Design",
          "description": "Complete brand identity design for local businesses",
          "thumbnailUrl": "/images/portfolio/brand-identity-thumb.jpg",
          "dateCreated": "2023-09-15"
        },
        {
          "@type": "VideoObject",
          "name": "Motion Graphics Reel",
          "description": "Highlights of motion design work for advertising campaigns",
          "thumbnailUrl": "/images/portfolio/motion-graphics-thumb.jpg",
          "uploadDate": "2024-02-20"
        },
        {
          "@type": "CreativeWork",
          "name": "UI/UX Design Project",
          "description": "User interface design for mobile applications",
          "thumbnailUrl": "/images/portfolio/ui-design-thumb.jpg",
          "dateCreated": "2024-01-10"
        }
      ]
    }
  };

  // Sample portfolio projects
  const portfolioProjects = [
    {
      id: 1,
      title: "Brand Identity Design",
      description: "Complete brand identity design including logo, color palette, typography, and brand guidelines",
      thumbnailUrl: "/images/portfolio/brand-identity-thumb.jpg",
      category: "Design",
      year: "2023",
      client: "Local Cafe"
    },
    {
      id: 2,
      title: "Motion Graphics Reel",
      description: "Collection of motion design work for various advertising campaigns featuring dynamic animations",
      thumbnailUrl: "/images/portfolio/motion-graphics-thumb.jpg",
      category: "Motion",
      year: "2024",
      client: "Various"
    },
    {
      id: 3,
      title: "UI/UX Design Project",
      description: "Comprehensive user interface design for mobile application with focus on user experience",
      thumbnailUrl: "/images/portfolio/ui-design-thumb.jpg",
      category: "Design",
      year: "2024",
      client: "Tech Startup"
    },
    {
      id: 4,
      title: "Animated Explainer Video",
      description: "Educational animated video explaining complex concepts through engaging visuals",
      thumbnailUrl: "/images/portfolio/explainer-thumb.jpg",
      category: "Motion",
      year: "2023",
      client: "Educational Institute"
    },
    {
      id: 5,
      title: "Social Media Campaign",
      description: "Series of animated graphics and videos for social media marketing campaign",
      thumbnailUrl: "/images/portfolio/social-media-thumb.jpg",
      category: "Motion",
      year: "2024",
      client: "Fashion Brand"
    },
    {
      id: 6,
      title: "Package Design",
      description: "Creative packaging design for consumer products with focus on sustainability",
      thumbnailUrl: "/images/portfolio/package-thumb.jpg",
      category: "Design",
      year: "2023",
      client: "Consumer Goods Company"
    }
  ];

  const categories = ['All', 'Design', 'Motion'];

  useEffect(() => {
    // Filter projects based on active category
    const filteredProjects = activeCategory === 'All' 
      ? portfolioProjects 
      : portfolioProjects.filter(project => project.category === activeCategory);
    
    setProjects(filteredProjects);
  }, [activeCategory]);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <SEOHead
        title="Design & Motion Graphics Portfolio - Thasya Ushsholikhah"
        description="Design and motion graphics portfolio showcasing creative works by Thasya Ushsholikhah"
        keywords="design portfolio, motion graphics, animation, UI design, brand identity, creative portfolio"
        url="https://spectrumclub.vercel.app/portfolio"
        schemaData={portfolioSchemaData}
      />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="portfolio-page">
          <nav className="portfolio-nav">
            <div className="nav-container">
              <div className="nav-logo">
                <Link to="/">TU</Link>
              </div>
              
              <div className="menu-toggle" onClick={toggleMenu}>
                <div className={`menu-icon ${menuOpen ? 'active' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              
              <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/portfolio" className="nav-link active">Portfolio</Link>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/services" className="nav-link">Services</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
              </div>
            </div>
          </nav>

          <div className="portfolio-header">
            <div className="creator-name">Thasya Ushsholikhah</div>
            <div className="portfolio-title">
              <h1>
                <span className="port">PORT</span>
                <span className="folio">FOLIO</span>
                <span className="year">2025</span>
              </h1>
            </div>
            <div className="portfolio-subtitle">
              <div className="subtitle-container">DESIGN & MOTION GRAPHIC</div>
            </div>
          </div>

          <div className="about-section">
            <h2>ABOUT ME</h2>
            <div className="about-content">
              <div className="about-image">
                <img src="/images/portfolio/profile-photo.jpg" alt="Thasya Ushsholikhah" />
              </div>
              <div className="about-text">
                <p>Hello! I'm Thasya, a passionate designer specializing in visual design and motion graphics. With 5+ years of experience, I create engaging visual stories that captivate audiences and deliver meaningful messages.</p>
                <p>My approach combines strategic thinking with creative execution to develop designs that not only look beautiful but also solve problems effectively.</p>
                <div className="about-skills">
                  <div className="skill">
                    <div className="skill-name">Adobe After Effects</div>
                    <div className="skill-bar"><div className="skill-level" style={{width: '95%'}}></div></div>
                  </div>
                  <div className="skill">
                    <div className="skill-name">Adobe Illustrator</div>
                    <div className="skill-bar"><div className="skill-level" style={{width: '90%'}}></div></div>
                  </div>
                  <div className="skill">
                    <div className="skill-name">Adobe Photoshop</div>
                    <div className="skill-bar"><div className="skill-level" style={{width: '85%'}}></div></div>
                  </div>
                  <div className="skill">
                    <div className="skill-name">UI/UX Design</div>
                    <div className="skill-bar"><div className="skill-level" style={{width: '80%'}}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="portfolio-section">
            <div className="section-heading">
              <h2>MY WORK</h2>
              <p>Selected projects from my recent design and motion graphics work</p>
            </div>
            
            <div className="portfolio-filters">
              {categories.map(category => (
                <button 
                  key={category}
                  className={`filter-button ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="portfolio-grid">
              {projects.map(project => (
                <div key={project.id} className="portfolio-item">
                  <div className="portfolio-item-inner">
                    <div className="portfolio-thumbnail">
                      <img src={project.thumbnailUrl || "/images/portfolio/placeholder.jpg"} alt={project.title} />
                    </div>
                    <div className="portfolio-overlay">
                      <div className="portfolio-category">{project.category}</div>
                      <h3 className="portfolio-title">{project.title}</h3>
                      <p className="portfolio-description">{project.description}</p>
                      <div className="portfolio-meta">
                        <span className="portfolio-year">{project.year}</span>
                        <span className="portfolio-client">{project.client}</span>
                      </div>
                      <Link to={`/portfolio/${project.id}`} className="view-project">View Project</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-section">
            <div className="contact-content">
              <h2>Let's Create Something Amazing</h2>
              <p>Interested in working together? Feel free to reach out!</p>
              <div className="contact-buttons">
                <a href="mailto:thasya@example.com" className="contact-button">Email Me</a>
                <a href="/contact" className="contact-button outline">Contact Form</a>
              </div>
              <div className="social-links">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://behance.net" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-behance"></i>
                </a>
                <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-dribbble"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
          
          <Footer />
        </div>
      )}
    </>
  );
};

export default VideoEditing; 