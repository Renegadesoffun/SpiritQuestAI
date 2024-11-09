import { createSlice } from '@reduxjs/toolkit';

const audioSlice = createSlice({
  name: 'audio',
  initialState: {
    volume: 0.5,
  },
  reducers: {
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
  },
});

export const { setVolume } = audioSlice.actions;
export default audioSlice.reducer;
