import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainMenu from '../components/MainMenu';
import Settings from '../components/Settings';
import GameMap from '../components/GameMap';
import StoryIntro from '../components/StoryIntro';
import Level from '../components/Level';
import FlappySpirit from '../components/FlappySpirit';
import MeditationRealm from '../components/MeditationRealm';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#1c092c' }
        }}
      >
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="GameMap" component={GameMap} />
        <Stack.Screen name="StoryIntro" component={StoryIntro} />
        <Stack.Screen name="Level" component={Level} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="FlappySpirit" component={FlappySpirit} />
        <Stack.Screen name="MeditationRealm" component={MeditationRealm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
