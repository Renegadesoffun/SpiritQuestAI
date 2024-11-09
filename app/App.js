import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity } from 'react-native';
import { ImmersiveMap } from './components/ImmersiveMap';
import { FloatingMenuButton } from './components/FloatingMenuButton';
import { StoryOverlay } from './components/StoryOverlay';
import { InitialTransition } from './components/InitialTransition';

export default function App() {
  const [showInitialStory, setShowInitialStory] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    // Start with story overlay that fades into map
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true
      }).start(() => setShowInitialStory(false));
    }, 5000); // Show initial story for 5 seconds
  }, []);

  return (
    <View style={styles.container}>
      <ImmersiveMap />
      
      <FloatingMenuButton 
        onPress={() => setMenuVisible(true)}
        style={styles.menuButton}
      />

      {showInitialStory && (
        <Animated.View style={[styles.storyOverlay, { opacity: fadeAnim }]}>
          <StoryOverlay />
        </Animated.View>
      )}

      <InitialTransition />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  storyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
