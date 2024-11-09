import React, { createContext, useContext, useState } from 'react';

const QuantumContext = createContext();

export const QuantumProvider = ({ children }) => {
  const [quantumState, setQuantumState] = useState(0);

  const updateQuantumState = (newState) => {
    setQuantumState(newState);
  };

  return (
    <QuantumContext.Provider value={{ quantumState, updateQuantumState }}>
      {children}
    </QuantumContext.Provider>
  );
};

export const useQuantum = () => useContext(QuantumContext);
