import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LightsCameraDiwali.css";

const LightsCameraDiwali = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize navigate

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="hero-section2" style={{ backgroundImage: "url('/images/LightsCamera.png')" }}>
            <div className="overlay"></div>
            <header className="navbar"></header>

            <div className="content2">
                {/* Back Button */}
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>

                <section className="event-header fade-in">
                    <h1 className="title">Lights, Camera, Diwali!</h1>
                    <img src="/images/LightsCamera.png" alt="Lights Camera Diwali Poster" className="event-poster" />
                </section>

                <section className="event-info-section fade-in">
                    <h2 className="info-title">Event Information</h2>
                    <p className="details">
                        Capture the magic of Diwali in a short video and share your unique story!
                        Showcase your creativity by filming the vibrant colours, heartwarming traditions,
                        or the joy of togetherness with your loved ones. Submit your video online and share
                        it with the entire community through the club's social media channels, allowing everyone
                        to virtually experience the festive spirit of Diwali!
                    </p>
                </section>

                <section className="video-section fade-in">
                    <h2 className="title">Event Highlights</h2>
                    <div className="video-container">
                        <iframe 
                            className="video-iframe" 
                            src="/videos/LCD.mp4" 
                            title="LightsCameraDiwali Video" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                        ></iframe>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LightsCameraDiwali;
