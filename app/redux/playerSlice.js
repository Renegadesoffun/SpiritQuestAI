import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wisdom: 0,
  compassion: 0,
  courage: 0,
  karma: 50,
  energy: 100,
  level: 1,
  experience: 0,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    updateStats: (state, action) => {
      Object.assign(state, action.payload);
    },
    gainExperience: (state, action) => {
      state.experience += action.payload;
      if (state.experience >= state.level * 100) {
        state.level += 1;
        state.experience -= (state.level - 1) * 100;
      }
    },
  },
});

export const { updateStats, gainExperience } = playerSlice.actions;
export default playerSlice.reducer;
