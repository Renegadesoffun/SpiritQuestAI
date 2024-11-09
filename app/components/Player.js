import React from 'react';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const Player = React.memo(({ position, rotation }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(position.x) },
        { translateY: withSpring(position.y) },
        { rotate: withSpring(rotation) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.player, animatedStyle]}>
      {/* Player design */}
    </Animated.View>
  );
});

export default Player;
