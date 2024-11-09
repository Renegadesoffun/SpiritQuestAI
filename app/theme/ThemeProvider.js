import React, { createContext, useContext, useState } from 'react';



const ThemeContext = createContext();



export const themes = {

  light: {

    background: '#FFFFFF',

    text: '#000000',

    primary: '#4A90E2',

    error: '#FF3B30',

    success: '#34C759',

  },

  dark: {

    background: '#000000',

    text: '#FFFFFF',

    primary: '#5856D6',

    error: '#FF453A',

    success: '#32D74B',

  },

};



export const useTheme = () => useContext(ThemeContext);



export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(themes.light);



  return (

    <ThemeContext.Provider value={{ theme, setTheme }}>

      {children}

    </ThemeContext.Provider>

  );

};


