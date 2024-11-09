import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SpiritTrail = ({ positions, color }) => {
  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <Svg width="100%" height="100%">
        {positions.map((pos, index) => (
          <Circle
            key={index}
            cx={pos.x}
            cy={pos.y}
            r={10 - index}
            fill={color}
            opacity={pos.opacity * (1 - index / positions.length)}
          />
        ))}
      </Svg>
    </View>
  );
};

export default SpiritTrail;
