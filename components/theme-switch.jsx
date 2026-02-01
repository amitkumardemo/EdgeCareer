"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from 'react'; // 👈 1. Import useState and useEffect

const ThemSwitch = () => {
  const [mounted, setMounted] = useState(false); // 👈 2. Define mounted state
  const { theme, setTheme } = useTheme();

  // 👈 3. Set mounted to true only after component mounts on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚨 4. CRITICAL FIX: If not mounted (Server or initial Client render), return a placeholder.
  // This ensures the server-rendered HTML matches the initial client HTML.
  if (!mounted) {
    // Return a button with the correct sizing to prevent layout shift
    return <button className="w-10 h-10 rounded-full" disabled />;
  }

  // 5. Render the actual, theme-dependent logic ONLY after mounting
  return theme === "dark" ? (
    <button
      onClick={() => setTheme("light")}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-950 shadow-md hover:shadow-lg transition-shadow duration-300"
      aria-label="Switch to light theme"
    >
      <SunIcon /> {/* Currently dark mode, show Sun to switch to light */}
    </button>
  ) : (
    <button
      onClick={() => setTheme("dark")}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-950 shadow-md hover:shadow-lg transition-shadow duration-300"
      aria-label="Switch to dark theme"
    >
      <MoonIcon /> {/* Currently light mode, show Moon to switch to dark */}
    </button>
  );
};

export default ThemSwitch;