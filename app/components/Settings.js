import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMusic, toggleSFX, setVolume } from '../store/audioSlice';

const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { musicEnabled, sfxEnabled, volume } = useSelector(state => state.audio);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => dispatch(toggleMusic())}
      >
        <Text style={styles.buttonText}>
          Music: {musicEnabled ? 'On' : 'Off'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => dispatch(toggleSFX())}
      >
        <Text style={styles.buttonText}>
          Sound Effects: {sfxEnabled ? 'On' : 'Off'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back</Text>
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
    fontSize: 36,
    color: '#ffffff',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3a1c54',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Settings;
