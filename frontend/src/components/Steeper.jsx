import React from "react";
import { FaBriefcase, FaUser, FaGraduationCap, FaClipboardList, FaProjectDiagram, FaDownload } from "react-icons/fa";

const Stepper = () => {
  const steps = [
    { icon: <FaBriefcase />, label: "Start Your Resume" },
    { icon: <FaUser />, label: "Fill the Form" },
    { icon: <FaGraduationCap />, label: "Preview Your Resume" },
    { icon: <FaClipboardList />, label: "Complete Details" },
    { icon: <FaProjectDiagram />, label: "Generate Resume" },
    { icon: <FaDownload />, label: "Download PDF" }
  ];

  return (
    <div className="stepper-container">
      {steps.map((step, index) => (
        <div key={index} className="step">
          <div className={`step-icon ${index === 2 ? 'active' : ''}`}>{step.icon}</div>
          <div className="step-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
