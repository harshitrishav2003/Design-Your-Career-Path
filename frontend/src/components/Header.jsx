import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For routing

const Header = () => {
  // State to track screen size for mobile
  const [isMobile, setIsMobile] = useState(false);

  // Update the state based on window size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Set to true if screen width is less than or equal to 768px
    };

    checkMobile(); // Check the screen size on component mount

    // Add event listener for resizing window
    window.addEventListener('resize', checkMobile);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header style={{ backgroundColor: '#000000', padding: '10px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',textAlign:'center' }}>
      <h1>Design Your Career Path</h1>
      <nav style={{ display: 'flex', gap: '15px', marginRight:'30px' }}>
        {/* Home link will be hidden if isMobile is true */}
        <Link to="/" style={{ ...linkStyle, display: isMobile ? 'none' : 'inline' }}>Home</Link>
        <Link to="/about" style={{ ...linkStyle, display: isMobile ? 'none' : 'inline' }}>
        About Us
      </Link>
      </nav>
    </header>
  );
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '1rem',
};

export default Header;
