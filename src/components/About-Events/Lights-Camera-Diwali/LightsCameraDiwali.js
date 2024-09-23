import React from "react";
import { useParams } from "react-router-dom";
import "./LightsCameraDiwali.css";

const LightsCameraDiwali = () => {
    const { id } = useParams();

    return (
        <div className="hero-section" style={{ backgroundImage: "url('/images/post.jpg')" }}>
            <div className="overlay"></div>
            <header className="navbar"></header>

            <div className="content">
                <section className="event-header fade-in">
                    <h1 className="title">Lights, Camera, Diwali!</h1>
                    <img src="/images/LightsCamera.png" alt="Lights Camera Diwali Poster" className="event-poster" />
                </section>

                <section className="event-info-section fade-in">
                    <h2 className="info-title">Event Information</h2>
                    <p className="details">
                        Celebrate the Festival of Lights with us on November 5, 2024! Join us for an evening filled with dazzling performances, delicious food, and joyful celebrations. 
                        Don't miss the chance to capture the magic of Diwali with our special photography contest!
                    </p>
                </section>

                <section className="video-section fade-in">
                    <h2 className="title" >Event Highlights</h2>
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
