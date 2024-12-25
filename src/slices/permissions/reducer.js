/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import permissionThunk from './thunk';

const initialState = {
  permissions: {},
  parents: [],
  tableLoading: false,
};

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL PERMISSIONS
      .addCase(permissionThunk.getAllPermissions.pending, state => {
        state.tableLoading = true;
      })
      .addCase(permissionThunk.getAllPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
        state.tableLoading = false;
      })
      .addCase(permissionThunk.getAllPermissions.rejected, state => {
        state.tableLoading = false;
      })

      // GET UNIQUE PERMISSIONS
      .addCase(permissionThunk.getUniqueParents.fulfilled, (state, action) => {
        state.parents = action.payload;
      });
  },
});

export default permissionSlice.reducer;
