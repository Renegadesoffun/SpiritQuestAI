import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
// Import other components as needed

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        {/* Add other screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
