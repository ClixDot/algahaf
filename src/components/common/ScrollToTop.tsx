import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Allow the DOM to settle then recalculate ScrollTrigger measurements
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
