// src/components/Loader.jsx
import React from 'react';
import '../styles/Loader.css'; // Import CSS file for animation

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loading-text">
        Loading<span className="dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </div>
  );
}
