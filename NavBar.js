import React from 'react';
import './NavBar.css'; // Optional: Create a CSS file for styles

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><a className="active" href="#home">Home</a></li>
        <li><a href="#news">Survey and Map</a></li>
        <li><a href="#contact">Data</a></li>
      </ul>
    </nav>
  );
};

export default NavBar;