import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MenuMusic from './MenuMusic';
import AudioEngine from '../audio/AudioEngine';
import { setVolume } from '../store/audioSlice';
import MusicComposer from '../audio/MusicComposer';

const MainMenu = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAudio = async () => {
      await AudioEngine.init();
      dispatch(setVolume(0.5));
    };
    initAudio();

    const startMenuMusic = async () => {
      try {
        await MusicComposer.init();
        await MusicComposer.playMenuMusic('main'); // Using the correct method name
      } catch (err) {
        console.warn('Failed to start menu music:', err);
      }
    };

    startMenuMusic();

    return () => {
      MusicComposer.stopAll();
    };
  }, [dispatch]);

  const handleStartJourney = async () => {
    try {
      // Remove heart frequency reference and use a standard sound instead
      await AudioEngine.playSound('crystal', 200, 0.3);
      navigation.navigate('GameMap');
    } catch (err) {
      console.warn('Failed to play sound:', err);
    }
  };

  return (
    <View style={styles.container}>
      <MenuMusic />
      <Text style={styles.title}>Spirit Quest</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleStartJourney}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Start Journey</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Settings')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c092c',
  },
  title: {
    fontSize: 48,
    color: '#ffffff',
    marginBottom: 40,
    fontWeight: 'bold',
    textShadowColor: '#3a1c54',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  button: {
    backgroundColor: '#3a1c54',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MainMenu;
