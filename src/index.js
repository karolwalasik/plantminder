import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {theme} from "./theme";
import {ThemeProvider} from "@mui/material";
import { MainContainer } from './components/MainContainer';
import { BrowserRouter } from 'react-router-dom'; // Add this import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MainContainer>
          <App />
        </MainContainer>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();