const React = require('react');
const { Svg, Circle, Path } = require('react-native-svg');

const Icon = () => (
  <Svg width="1024" height="1024" viewBox="0 0 1024 1024">
    <Circle cx="512" cy="512" r="512" fill="#1c092c" />
    <Path
      d="M512 200L732 400V800H292V400Z"
      fill="#ffffff"
      stroke="#3a1c54"
      strokeWidth="20"
    />
  </Svg>
);

module.exports = Icon;
