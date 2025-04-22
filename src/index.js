import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Removed import './index.css' if you moved all styles to Abacus.css

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
