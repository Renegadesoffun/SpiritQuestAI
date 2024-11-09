import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';

const AdaptiveIcon = () => (
  <Svg width="108" height="108" viewBox="0 0 108 108">
    <Circle cx="54" cy="54" r="54" fill="#1c092c" />
    <Path
      d="M54 20L76 40L76 80L32 80L32 40Z"
      fill="#ffffff"
      stroke="#3a1c54"
      strokeWidth="2"
    />
  </Svg>
);

export default AdaptiveIcon;
