import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/animations.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { setOptions } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY } from './utils/config';

// Initialize Google Maps API options globally
setOptions({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly",
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
