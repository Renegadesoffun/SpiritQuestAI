import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unlockedAchievements: [],
};

export const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    unlockAchievement: (state, action) => {
      if (!state.unlockedAchievements.includes(action.payload)) {
        state.unlockedAchievements.push(action.payload);
      }
    },
  },
});

export const { unlockAchievement } = achievementsSlice.actions;
export default achievementsSlice.reducer;
