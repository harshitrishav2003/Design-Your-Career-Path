import React, { useState } from 'react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    // Here, you can send the form data to an API or handle it as required
  };

  return (
    <div style={formContainerStyle}>
      <h2>Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={inputGroupStyle}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="feedback">Feedback:</label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            placeholder="Your Feedback"
            required
            style={textareaStyle}
          />
        </div>

        <button type="submit" style={submitButtonStyle}>Submit</button>
      </form>
    </div>
  );
};

const formContainerStyle = {
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  width: '80%',
  margin: '20px auto',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const inputGroupStyle = {
  marginBottom: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  height: '100px',
};

const submitButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
};

export default FeedbackForm;
