import { useState, useEffect } from 'react';

/**
 * useMobile Hook
 *
 * Detects if the user is on a mobile device based on:
 * 1. Viewport width (max-width: 768px)
 * 2. User agent string (Android, iPhone, iPad, iPod)
 * 3. Touch support (as secondary indicator)
 *
 * Returns boolean indicating mobile status.
 * Listens to window resize events to update dynamically.
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => detectMobile());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(detectMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

/**
 * Detects mobile device using multiple heuristics
 */
function detectMobile(): boolean {
  // Check viewport width
  const isNarrowViewport = window.matchMedia('(max-width: 768px)').matches;

  // Check user agent
  const isMobileUserAgent = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

  // Touch support as additional indicator (but not sole factor as laptops can have touch)
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Consider mobile if viewport is narrow OR (mobile user agent AND touch support)
  return isNarrowViewport || (isMobileUserAgent && hasTouchSupport);
}

/**
 * useTouchDevice Hook
 *
 * Specifically detects if the user is on a touch-capable device.
 * Used for disabling hover effects on touch devices.
 */
export function useTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(() => detectTouchDevice());

  useEffect(() => {
    const handleResize = () => {
      setIsTouchDevice(detectTouchDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isTouchDevice;
}

/**
 * Detects touch device
 */
function detectTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
  );
}
