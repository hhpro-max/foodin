import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isRTL] = useState(true); // Always RTL for Persian
  const [theme] = useState({
    colors: {
      primary: '#2C3E50', // Persian Blue
      secondary: '#E74C3C', // Persian Red
      accent: '#F1C40F', // Persian Gold
      background: '#F5F6FA',
      text: '#2C3E50',
    },
    fontFamily: 'Vazirmatn, sans-serif',
    direction: 'rtl',
  });

  const value = {
    isRTL,
    theme,
    dir: isRTL ? 'rtl' : 'ltr',
  };

  return (
    <ThemeContext.Provider value={value}>
      <div dir={value.dir} style={{ fontFamily: theme.fontFamily }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 