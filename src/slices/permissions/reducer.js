import { createSlice } from '@reduxjs/toolkit';
import permissionThunk from './thunk';

const initialState = {
  permissions: {},
  parents: [],
  isLoading: false,
  errorMsg: '',
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL PERMISSIONS
      .addCase(permissionThunk.getAllPermissions.pending, state => {
        state.isLoading = true;
      })
      .addCase(permissionThunk.getAllPermissions.fulfilled, (state, action) => {
        state.permissions = action?.payload;
        state.isLoading = false;
      })
      .addCase(permissionThunk.getAllPermissions.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
        state.isLoading = false;
      })

      // GET UNIQUE PARENTS
      .addCase(permissionThunk.getUniqueParents.pending, state => {
        state.isLoading = true;
      })
      .addCase(permissionThunk.getUniqueParents.fulfilled, (state, action) => {
        state.parents = action?.payload;
        state.isLoading = false;
      })
      .addCase(permissionThunk.getUniqueParents.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
        state.isLoading = false;
      })

      // CREATE PERMISSION
      .addCase(permissionThunk.createPermission.pending, state => {
        state.isLoading = true;
      })
      .addCase(permissionThunk.createPermission.fulfilled, state => {
        state.isLoading = false;
      })

      .addCase(permissionThunk.createPermission.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
        state.isLoading = false;
      })

      // EDIT PERMISSION
      .addCase(permissionThunk.editPermission.pending, state => {
        state.isLoading = true;
      })
      .addCase(permissionThunk.editPermission.fulfilled, state => {
        state.isLoading = false;
      })

      .addCase(permissionThunk.editPermission.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
        state.isLoading = false;
      })

      // DELETE PERMISSION
      .addCase(permissionThunk.deletePermission.pending, state => {
        state.isLoading = true;
      })
      .addCase(permissionThunk.deletePermission.fulfilled, state => {
        state.isLoading = false;
      })

      .addCase(permissionThunk.deletePermission.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
        state.isLoading = false;
      });
  },
});

export default permissionSlice.reducer;
