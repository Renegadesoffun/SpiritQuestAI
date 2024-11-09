import { configureStore } from '@reduxjs/toolkit';
import audioReducer from './audioSlice';
import gameReducer from './gameSlice';

export const store = configureStore({
  reducer: {
    audio: audioReducer,
    game: gameReducer
  },
});
