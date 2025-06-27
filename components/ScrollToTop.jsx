"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  const iconColor = theme === "dark" ? "black" : "white";

  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp color={iconColor} className="h-5 w-5" />
      </button>
    )
  );
};

export default ScrollToTop;
