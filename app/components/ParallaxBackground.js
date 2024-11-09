import React from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';

const ParallaxBackground = ({ images, speed }) => {
  const position = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(position, {
        toValue: -Dimensions.get('window').width,
        duration: speed,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {images.map((image, index) => (
        <Animated.Image
          key={index}
          source={image}
          style={[
            styles.backgroundImage,
            {
              transform: [
                {
                  translateX: position.interpolate({
                    inputRange: [-Dimensions.get('window').width, 0],
                    outputRange: [0, Dimensions.get('window').width],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    width: Dimensions.get('window').width * 2,
    height: Dimensions.get('window').height,
  },
});

export default ParallaxBackground;
