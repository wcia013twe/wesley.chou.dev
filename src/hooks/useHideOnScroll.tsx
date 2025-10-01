// src/hooks/useHideOnScroll.js
import { useState, useEffect } from 'react';

// Returns true until the user has scrolled past a certain point
const useHideOnScroll = (threshold = 50) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // Use requestAnimationFrame for better performance
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setIsVisible(scrollPosition <= threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]); // Re-run effect if threshold changes

  return isVisible;
};

export default useHideOnScroll;