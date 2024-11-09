import React from 'react';



import { createStackNavigator } from '@react-navigation/stack';



import { useTheme } from '../theme/ThemeProvider';



import MainMenu from './MainMenu';



import GameMap from './GameMap';



import StoryIntro from './StoryIntro';



import Level from './Level';



import FlappySpirit from './FlappySpirit';



import MeditationRealm from './MeditationRealm';



import ErrorDimension from './ErrorDimension';



import CosmicErrorTranscendence from './CosmicErrorTranscendence';



import AIConsciousnessQuest from './AIConsciousnessQuest';



import PurpleScreenOfEnlightenment from './PurpleScreenOfEnlightenment';



import AudioEngine from '../audio/AudioEngine';







const Stack = createStackNavigator();







const MainGame = () => {



  const { theme } = useTheme();



  return (



    <Stack.Navigator



      initialRouteName="MainMenu"



      screenOptions={{



        headerShown: false,



        cardStyle: { backgroundColor: theme.background },



      }}



    >



      <Stack.Screen name="MainMenu" component={MainMenu} />



      <Stack.Screen name="GameMap" component={GameMap} />



      <Stack.Screen name="StoryIntro" component={StoryIntro} />



      <Stack.Screen name="Level" component={Level} />



      <Stack.Screen name="FlappySpirit" component={FlappySpirit} />



      <Stack.Screen name="MeditationRealm" component={MeditationRealm} />



      <Stack.Screen name="QuantumSpiritJourney" component={QuantumSpiritJourney} />



      <Stack.Screen name="ErrorDimension" component={ErrorDimension} />



      <Stack.Screen name="CosmicErrorTranscendence" component={CosmicErrorTranscendence} />



      <Stack.Screen name="AIConsciousnessQuest" component={AIConsciousnessQuest} />



      <Stack.Screen name="PurpleScreenOfEnlightenment" component={PurpleScreenOfEnlightenment} />



    </Stack.Navigator>



  );



};







export default MainGame;








