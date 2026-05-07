import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
if (window.location.hash && window.location.hash.includes('access_token')) {
  window.location.replace('/auth/callback' + window.location.hash);
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
