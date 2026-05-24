import React from 'react';
import '../../styles/LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', inline = false }) {
  return (
    <div
      className={`spinner spinner-${size} ${inline ? 'spinner-inline' : ''}`}
      role="status"
      aria-label="Loading"
    >
      <div className="spinner-ring" />
    </div>
  );
}
