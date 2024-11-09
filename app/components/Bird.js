import React from 'react';
import { View } from 'react-native';

const Bird = ({ size = 50, color = '#ffd700' }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: '#ffffff',
      }}
    />
  );
};

export default Bird;
