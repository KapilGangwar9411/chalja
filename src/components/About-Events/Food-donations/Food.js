import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Food = () => {
    const navigate = useNavigate();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="lcdiwali-coming-soon-container">
            {/* Back Button */}
            <button className="lcdiwali-back-button" onClick={() => navigate(-1)}>Back</button>
            
            <h1 className="lcdiwali-coming-soon-text">Coming Soon</h1>
        </div>
    );
};

export default Food;
