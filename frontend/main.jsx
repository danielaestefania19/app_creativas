import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/styles.css'
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
      <App />
      </ThemeProvider> 
    </Router>
  </React.StrictMode>
);
