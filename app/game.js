import React, { useEffect } from 'react';

import { View, StyleSheet } from 'react-native';

import { Audio } from 'expo-av';

import { NavigationContainer } from '@react-navigation/native';

import { Provider } from 'react-redux';

import { store } from './store';

import MainGame from './components/MainGame';

import { ThemeProvider } from './theme/ThemeProvider';

import ErrorBoundary from './components/ErrorBoundary';



const Game = () => {

  useEffect(() => {

    const setupAudio = async () => {

      try {

        await Audio.setAudioModeAsync({

          allowsRecordingIOS: false,

          playsInSilentModeIOS: true,

          staysActiveInBackground: true,

          shouldDuckAndroid: true,

        });

      } catch (error) {

        console.error('Failed to setup audio:', error);

      }

    };



    setupAudio();

  }, []);



  return (

    <Provider store={store}>

      <ErrorBoundary>

        <ThemeProvider>

          <NavigationContainer>

            <View style={styles.container}>

              <MainGame />

            </View>

          </NavigationContainer>

        </ThemeProvider>

      </ErrorBoundary>

    </Provider>

  );

};



const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: '#1c092c',

  },

});



export default Game;


