import React from 'react';
import { View } from 'react-native';

const Obstacle = ({ body, size, color = '#2ecc71' }) => {
  if (!body || !size) {
    console.warn('Obstacle body or size is undefined');
    return null;
  }

  const [width, height] = size;
  const xPos = body.position.x - width / 2;
  const yPos = body.position.y - height / 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: xPos,
        top: yPos,
        width: width,
        height: height,
        backgroundColor: color,
        borderRadius: 5,
      }}
    />
  );
};

export default Obstacle;
