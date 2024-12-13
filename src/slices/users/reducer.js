import { createSlice } from '@reduxjs/toolkit';
import userThunk from './thunk';

const initialState = {
  users: {},
  isLoading: false,
  errorMsg: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL USERS
      .addCase(userThunk.getAllUsers.pending, state => {
        state.isLoading = true;
      })
      .addCase(userThunk.getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action?.payload;
      })
      .addCase(userThunk.getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      });
  },
});

export default userSlice.reducer;
