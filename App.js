import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markericon from "./marker.png";
import HomePage from './HomePage.js'; // Import the Home Page component
import buildingsData from './buildings.json'; // Import buildings data
import './App.css'; // Custom styling
import NavBar from './NavBar.js'; // Import the NavBar component

// Custom marker icon
const icon = L.icon({
  iconUrl: markericon,
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const App = () => {
  const [buildings, setBuildings] = useState(buildingsData); // Use state to hold buildings data
  const [presenceReport, setPresenceReport] = useState({ buildingId: "", wasPresent: false });
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [surveyContent, setSurveyContent] = useState(''); // State to hold the survey HTML

  useEffect(() => {
    fetch('/survey.html')
      .then(response => response.text())
      .then(data => setSurveyContent(data))
      .catch(error => console.error("Error loading survey:", error));
  }, []);

  // Handle the user's response (yes/no for spending more than 15 minutes)
  const handlePresenceChange = (response) => {
    setPresenceReport((prevState) => ({
      ...prevState,
      wasPresent: response,
    }));
  };

  // Handle form submission for reporting presence in a building
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new report object
      const newReport = {
        date: new Date(), // Current date
        wasPresent: presenceReport.wasPresent,
      };

      // Update the buildings state with the new report
      const updatedBuildings = buildings.map((building) => {
        if (building.name === presenceReport.buildingId) {
          return {
            ...building,
            reports: [...building.reports, newReport], // Add the new report to the building's reports
          };
        }
        return building; // Return the building unchanged
      });

      // Update the buildings state
      setBuildings(updatedBuildings); // Update the state with new buildings array

      alert("Presence report submitted successfully!");
      setPresenceReport({ buildingId: "", wasPresent: false }); // Reset report after submission
    } catch (error) {
      alert("Error submitting report.");
    }
  };

  // Handle "View Reports" button click
  const handleViewReports = (building) => {
    setSelectedBuilding(building);
    alert(`Viewing reports for: ${building.name}`);
  };

  return (
    <div className="App">
      <div className="title-box">
        <h1>Syracuse University Health Tracker Map</h1>
      </div>
      <NavBar />  

      {/* Map Section */}
      <MapContainer center={[43.0389, -76.1340]} zoom={15} style={{ height: "500px", width: "90%", margin: "0 auto" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {buildings.map((building, index) => (
          <Marker key={index} position={[building.lat, building.lng]} icon={icon}>
            <Popup>
              <h2>{building.name}</h2>
              <p>{building.reports.length} recent reports</p>
              <ul>
                {building.reports.slice(-3).map((report, idx) => (
                  <li key={idx}>
                    Present for more than 15 minutes: {report.wasPresent ? "Yes" : "No"} - {new Date(report.date).toLocaleString()}
                  </li>
                ))}
              </ul>

              {/* Presence report form */}
              <form onSubmit={handleSubmit}>
                <input
                  type="hidden"
                  name="buildingId"
                  value={building.name}
                  onChange={(e) =>
                    setPresenceReport({ ...presenceReport, buildingId: e.target.value })
                  }
                />

                {/* Yes/No buttons for presence */}
                <div className="presence-question">
                  <p>Were you in this building for more than 15 minutes?</p>
                  <button
                    type="button"
                    onClick={() => handlePresenceChange(true)}
                    className={`presence-button ${presenceReport.wasPresent ? "selected" : ""}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresenceChange(false)}
                    className={`presence-button ${!presenceReport.wasPresent ? "selected" : ""}`}
                  >
                    No
                  </button>
                </div>

                <button type="submit" className="submit-button">Submit Report</button>
              </form>

              <button onClick={() => handleViewReports(building)} className="custom-button">
                View Reports
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Building Details Section */}
      {selectedBuilding && (
        <div className="building-details">
          <h2>{selectedBuilding.name} - Detailed Reports</h2>
          <ul>
            {selectedBuilding.reports.map((report, idx) => (
              <li key={idx}>
                Present for more than 15 minutes: {report.wasPresent ? "Yes" : "No"} - {new Date(report.date).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Survey Section */}
      <div className="survey-section">
        <div dangerouslySetInnerHTML={{ __html: surveyContent }} /> 
      </div>
    </div>
  );
};

// Main component with routing
const MainApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home page route */}
        <Route path="/app" element={<App />} />    {/* Map page (App.js) route */}
      </Routes>
    </Router>
  );
};

export default MainApp;
