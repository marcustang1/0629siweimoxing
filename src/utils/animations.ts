// animations.ts - This file provides animation utilities for components

// This function can be imported by components to initialize fade-in animations
export const initializeFadeAnimations = (
  sectionRef: React.RefObject<HTMLElement>,
  itemRefs: React.RefObject<(HTMLElement | null)[]>
) => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(handleIntersect, observerOptions);
  
  if (sectionRef.current) {
    observer.observe(sectionRef.current);
  }
  
  if (itemRefs.current) {
    itemRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
  }

  return () => {
    observer.disconnect();
  };
};