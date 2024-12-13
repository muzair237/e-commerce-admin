/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import authThunk from './thunk';

const initialState = {
  user: {},
  hasPermission: [],
  isLoggedIn: false,
  isLoading: false,
  errorMsg: '',
  allowedPages: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // LOGIN
      .addCase(authThunk.login.pending, state => {
        state.isLoading = true;
      })
      .addCase(authThunk.login.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(authThunk.login.rejected, state => {
        state.isLoading = false;
      })

      // ME
      .addCase(authThunk.me.pending, state => {
        state.isLoading = true;
      })
      .addCase(authThunk.me.fulfilled, (state, action) => {
        const { permissions, allowedPages, ...rest } = action?.payload || {};
        state.user = rest;
        state.hasPermission = permissions;
        state.isLoggedIn = true;
        state.allowedPages = allowedPages;
        state.isLoading = false;
      })
      .addCase(authThunk.me.rejected, state => {
        state.isLoading = false;
      })

      // LOGOUT
      .addCase(authThunk.logout.pending, state => {
        state.isLoading = true;
      })
      .addCase(authThunk.logout.fulfilled, state => {
        state.user = {};
        state.isLoggedIn = false;
        state.isLoading = false;
        state.allowedPages = [];
      })
      .addCase(authThunk.logout.rejected, state => {
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
