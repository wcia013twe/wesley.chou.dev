import { useState, useEffect } from 'react';

/**
 * Auto-hides an element after `delay` ms on mount.
 * Reveals it again whenever the 'nav-reveal-header' custom event fires
 * (dispatched by NavBar on any nav link click).
 * The timer does NOT restart on reveal — once the user brings it back
 * it stays visible until the next page mount.
 */
export function useAutoHideHeader(delay = 3000) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), delay);
    const show = () => setVisible(true);
    window.addEventListener('nav-reveal-header', show);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('nav-reveal-header', show);
    };
  }, [delay]);

  return visible;
}
