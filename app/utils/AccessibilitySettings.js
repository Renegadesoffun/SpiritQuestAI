import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [colorBlindMode, setColorBlindMode] = useState('normal');
  const [textSize, setTextSize] = useState('medium');

  const updateSettings = async (setting, value) => {
    if (setting === 'colorBlindMode') setColorBlindMode(value);
    if (setting === 'textSize') setTextSize(value);
    await AsyncStorage.setItem(setting, value);
  };

  return (
    <AccessibilityContext.Provider value={{ colorBlindMode, textSize, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
