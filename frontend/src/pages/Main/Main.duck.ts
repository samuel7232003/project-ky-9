import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface MainState {
  // Define state properties here if needed in the future
  isOpenMenu: boolean;
}
// Initial state
const initialState: MainState = {
  isOpenMenu: true,
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isOpenMenu = !state.isOpenMenu;
    },
  },
});

export const { toggleMenu } = mainSlice.actions;
export default mainSlice.reducer;