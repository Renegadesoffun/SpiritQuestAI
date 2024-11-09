import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showSplash: true,
  currentScreen: 'menu',
  showTutorial: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowSplash: (state, action) => {
      state.showSplash = action.payload;
    },
    setCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
    setShowTutorial: (state, action) => {
      state.showTutorial = action.payload;
    },
  },
});

export const { setShowSplash, setCurrentScreen, setShowTutorial } = uiSlice.actions;
export default uiSlice.reducer;
