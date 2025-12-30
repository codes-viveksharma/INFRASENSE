import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage, default to light
    const savedTheme = localStorage.getItem('smart-city-theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // Update HTML class and localStorage
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smart-city-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smart-city-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};