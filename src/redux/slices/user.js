import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  employer: {},
};
console.log('initialState', initialState);
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    
    setUser(state, action) {
      state.user = action.payload;
    },
    setEmployer(state, action) {
      state.employer = action.payload;
    },

  },
});

export default slice.reducer;

export const { setUser, setEmployer } = slice.actions;


