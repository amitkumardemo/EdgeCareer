"use client";

import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensures rendering happens only after client mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoids hydration mismatch
  }

  const iconClasses = "w-5 h-5 transition-colors duration-300";

  return theme === "dark" ? (
    <button
      onClick={() => setTheme("light")}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-950 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      {/* In dark mode, Sun icon is shown → use bright color */}
      <SunIcon className={`${iconClasses} text-yellow-500`} />
    </button>
  ) : (
    <button
      onClick={() => setTheme("dark")}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-950 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      {/* In light mode, Moon icon is shown → use dark or blue color */}
      <MoonIcon className={`${iconClasses} text-blue-600`} />
    </button>
  );
};

export default ThemeSwitch;
