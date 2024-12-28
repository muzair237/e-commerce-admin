/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import rolesThunk from './thunk';

const initialState = {
  roles: {},
  uniqueRoles: [],
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
      })

      // GET UNIQUE ROLES
      .addCase(rolesThunk.getUniqueRoles.fulfilled, (state, action) => {
        state.uniqueRoles = action.payload;
      });
  },
});

export default roleSlice.reducer;
