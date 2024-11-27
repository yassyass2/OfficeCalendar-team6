import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Ensure this matches your App component file
import './index.css'; // Optional: Include global styles if needed

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // This is the `#root` element in your `index.html`
);
