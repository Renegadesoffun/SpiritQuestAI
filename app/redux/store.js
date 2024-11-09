import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import gameProgressReducer from './gameProgressSlice';
import achievementsReducer from './achievementsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    gameProgress: gameProgressReducer,
    achievements: achievementsReducer,
    ui: uiReducer,
  },
});
