
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Extend the Window interface to include gaOptout
declare global {
  interface Window {
    gaOptout: () => void;
    ['ga-disable-G-SR9PMHBZ68']: boolean;
  }
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Add a listener to handle URL fragments/anchors after navigation
window.addEventListener('load', () => {
  // Check if there's a hash in the URL
  if (window.location.hash) {
    // Remove the # character
    const id = window.location.hash.substring(1);
    
    // Give the browser a moment to render the page
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }
  
  // Google Analytics opt-out function
  window.gaOptout = function() {
    document.cookie = 'ga-disable-G-SR9PMHBZ68=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
    window['ga-disable-G-SR9PMHBZ68'] = true;
    alert('Google Analytics wurde für diese Webseite deaktiviert.');
  };
});
