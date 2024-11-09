import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    currentLevel: 1,
    unlockedLevels: [1],
    score: 0
  },
  reducers: {
    setLevel: (state, action) => {
      state.currentLevel = action.payload;
    },
    unlockLevel: (state, action) => {
      if (!state.unlockedLevels.includes(action.payload)) {
        state.unlockedLevels.push(action.payload);
      }
    },
    setScore: (state, action) => {
      state.score = action.payload;
    }
  }
});

export const { setLevel, unlockLevel, setScore } = gameSlice.actions;
export default gameSlice.reducer;
