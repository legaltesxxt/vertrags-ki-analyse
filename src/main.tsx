
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
});
