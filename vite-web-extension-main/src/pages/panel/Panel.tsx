import React from 'react';
import '@pages/panel/Panel.css';
import CloudBackground from '../../assets/animations/CloudBackground';

export default function Panel() {
  return (
    <div className="container">
      <CloudBackground/>
      <h1>Side Panel</h1>
    </div>
  );
}
