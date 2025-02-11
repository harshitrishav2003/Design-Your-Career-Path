// import React, { useState } from 'react';
// import ResumeInputForm from './components/ResumeInputForm.jsx';
// import Preview from './components/Preview.jsx';

// const App = () => {
//   const [resumeData, setResumeData] = useState(null);

//   const handleFormSubmit = (data) => {
//     setResumeData(data);
//   };

//   return (
//     <div>
//       <h1>Resume Maker</h1>
//       <ResumeInputForm onSubmit={handleFormSubmit} />
//       {resumeData && <Preview data={resumeData} />}
//     </div>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/Home";
import ResumeInputForm from "./components/ResumeInputForm";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutUs from './components/aboutUs';
import "./App.css";
import { Analytics } from "@vercel/analytics/react"


const App = () => {
  return (
    <Router>
      <Analytics />
      <div className="app-container">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/result-form" element={<ResumeInputForm />} />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
