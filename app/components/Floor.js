import React from 'react';
import { View } from 'react-native';
import Matter from 'matter-js';

const Floor = ({ body, color }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;

  return (
    <View
      style={{
        position: 'absolute',
        left: body.position.x - width / 2,
        top: body.position.y - height / 2,
        width: width,
        height: height,
        backgroundColor: color || '#3a1c54',
      }}
    />
  );
};

export default Floor;
