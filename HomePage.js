import React from "react";
import { useNavigate } from "react-router-dom";
import './HomePage.css'; 

const HomePage = () => {
  const navigate = useNavigate();

  const goToMapPage = () => {
    navigate('/app');
  };

  return (
    <div className="home-page-container">
      {/* Bubble for the Welcome message */}
      <div className="welcome-bubble">
        <h1 className="welcome-title">Welcome to Syracuse University Health Tracker</h1>
      </div>

      {/* Main bubble for mission statement and other content */}
      <div className="hero-section">
        <p className="mission-statement">
          Our mission is to promote health and wellness in the Syracuse community.
        </p>
        <p className="hero-description">
          Stay informed about health updates across the campus.
          Explore reports and track wellness trends by clicking the button below.
        </p>
        <button className="start-button" onClick={goToMapPage}>
          Explore the Map
        </button>
      </div>
    </div>
  );
};

export default HomePage;
