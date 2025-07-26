"use client";
import { useState, useRef, useEffect } from "react";

function useIntersectionObserver(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      {
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
  }, [threshold]);

  return [ref, isVisible];
}

export default useIntersectionObserver;
