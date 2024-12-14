/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import authThunk from './thunk';

const initialState = {
  user: {},
  hasPermission: [],
  isLoggedIn: false,
  errorMsg: '',
  allowedPages: [],
  isSessionExpired: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSessionExpiredModalState(state) {
      state.isSessionExpired = true;
    },
  },
  extraReducers: builder => {
    builder

      // ME
      .addCase(authThunk.me.fulfilled, (state, action) => {
        const { permissions, allowedPages, ...rest } = action?.payload || {};
        state.user = rest;
        state.hasPermission = permissions;
        state.isLoggedIn = true;
        state.allowedPages = allowedPages;
      })

      .addCase(authThunk.me.rejected, (state, action) => {
        if (action?.payload === '401 Unauthorized') state.isSessionExpired = true;

        state.errorMsg = action.payload;
      })

      // LOGOUT
      .addCase(authThunk.logout.fulfilled, state => {
        state.user = {};
        state.isLoggedIn = false;
        state.hasPermission = [];
        state.allowedPages = [];
        state.isSessionExpired = false;
      });
  },
});

export const { setSessionExpiredModalState } = authSlice.actions;

export default authSlice.reducer;
