import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js'; // Import the main App component
import './index.css'; // Optional: Import CSS styles


// Render the App component into the root element
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Ensure there is a div with id 'root' in your index.html
);
