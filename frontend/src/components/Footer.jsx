import React from 'react';
import { FaLinkedin } from 'react-icons/fa';  // Import LinkedIn icon

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#000000', padding: '10px', color: 'white', textAlign: 'center' }}>
      <p>&copy; 2024. All Rights Reserved.</p>
      <p>
        Maintained & Developed by 
        <a 
          href="https://in.linkedin.com/in/harshit-rishav-7683a2201"  // Replace with the correct LinkedIn URL
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'white', textDecoration: 'none', marginLeft: '5px' }}
        >
          Harshit Rishav <FaLinkedin style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
        </a>
      </p>
    </footer>
  );
};

export default Footer;
