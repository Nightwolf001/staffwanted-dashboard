import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
};
console.log('initialState', initialState);
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    
    setUser(state, action) {
      console.log('action.payload', action.payload);
      state.user = action.payload;
    },

  },
});

export default slice.reducer;

export const { setUser } = slice.actions;


