/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import rolesThunk from './thunk';

const initialState = {
  roles: {},
  tableLoading: false,
};

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL ROLES
      .addCase(rolesThunk.getAllRoles.pending, state => {
        state.tableLoading = true;
      })
      .addCase(rolesThunk.getAllRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
        state.tableLoading = false;
      })
      .addCase(rolesThunk.getAllRoles.rejected, state => {
        state.tableLoading = false;
      });
  },
});

export default roleSlice.reducer;
