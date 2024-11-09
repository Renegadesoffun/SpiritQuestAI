import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';

const ProceduralSplashGenerator = ({ width, height }) => {
  const generateRandomPath = () => {
    const points = [];
    for (let i = 0; i < 5; i++) {
      points.push(`${Math.random() * width},${Math.random() * height}`);
    }
    return `M${points.join(' L')}Z`;
  };

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Circle cx={width / 2} cy={height / 2} r={Math.min(width, height) / 4} fill="#3498db" />
      <Path d={generateRandomPath()} fill="#2ecc71" opacity="0.5" />
      <Path d={generateRandomPath()} fill="#e74c3c" opacity="0.5" />
      <Path d={generateRandomPath()} fill="#f39c12" opacity="0.5" />
    </Svg>
  );
};

export default ProceduralSplashGenerator;
