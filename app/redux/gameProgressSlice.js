import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unlockedLevels: [0],
  completedMiniGames: [],
  currentChapter: 1,
  spiritualProgress: 0,
};

export const gameProgressSlice = createSlice({
  name: 'gameProgress',
  initialState,
  reducers: {
    unlockLevel: (state, action) => {
      if (!state.unlockedLevels.includes(action.payload)) {
        state.unlockedLevels.push(action.payload);
      }
    },
    completeMiniGame: (state, action) => {
      if (!state.completedMiniGames.includes(action.payload)) {
        state.completedMiniGames.push(action.payload);
      }
    },
    advanceChapter: (state) => {
      state.currentChapter += 1;
    },
    updateSpiritualProgress: (state, action) => {
      state.spiritualProgress = action.payload;
    },
  },
});

export const { unlockLevel, completeMiniGame, advanceChapter, updateSpiritualProgress } = gameProgressSlice.actions;
export default gameProgressSlice.reducer;
