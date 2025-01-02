import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Stepper from "../components/Steeper";
import resumeImage from '../components/formatResume.png';
import screenshot from "../components/Sample.png";  // Import the screenshot

const HomePage = () => {
  return (
    <div>
    <div className="home-container">
    <div className="home-text">
    <div className="home-creative-card">
        <h2 className="home-creative-line">Tired of formatting resumes? <p>Let’s create one the smart way!</p></h2>
      </div>
      <h1 className="home-title">Welcome to Resume Maker</h1>
      <p className="home-subtitle">Create your professional resume in minutes.</p>
      <Link to="/result-form">
        <button className="start-button">Start My Resume</button>
      </Link>
    </div>
    <div className="home-image">
      <img src={resumeImage} alt="Resume Maker" className="home-photo" />
    </div>
    </div>
    <div className="home-wrapper">
      <div className="laptop-container">
        <div className="laptop-screen">
        <img src={screenshot} alt="Resume Maker UI" className="laptop-screenshot" />
        </div>
      </div>
      <div className="stepper-container">
        <Stepper />
      </div>
    </div>
  </div>

  
);
};

export default HomePage;
