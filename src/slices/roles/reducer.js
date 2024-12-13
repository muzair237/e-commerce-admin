import { createSlice } from '@reduxjs/toolkit';
import roleThunk from './thunk';

const initialState = {
  roles: {},
  permissions: [],
  isLoading: false,
  errorMsg: '',
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL ROLES
      .addCase(roleThunk.getAllRoles.pending, state => {
        state.isLoading = true;
      })
      .addCase(roleThunk.getAllRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = action?.payload;
      })
      .addCase(roleThunk.getAllRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      })

      // GET UNIQUE PARENTS
      .addCase(roleThunk.getUniqueParents.fulfilled, (state, action) => {
        state.permissions = action?.payload;
      })
      .addCase(roleThunk.getUniqueParents.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
      })

      // CREATE ROLE
      .addCase(roleThunk.createRole.pending, state => {
        state.isLoading = true;
      })
      .addCase(roleThunk.createRole.fulfilled, state => {
        state.isLoading = false;
      })

      .addCase(roleThunk.createRole.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
        state.isLoading = false;
      })

      // EDIT ROLE
      .addCase(roleThunk.editRole.pending, state => {
        state.isLoading = true;
      })
      .addCase(roleThunk.editRole.fulfilled, state => {
        state.isLoading = false;
      })

      .addCase(roleThunk.editRole.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
        state.isLoading = false;
      })

      // DELETE ROLE
      .addCase(roleThunk.deleteRole.pending, state => {
        state.isLoading = true;
      })
      .addCase(roleThunk.deleteRole.fulfilled, state => {
        state.isLoading = false;
      })

      .addCase(roleThunk.deleteRole.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
        state.isLoading = false;
      });
  },
});

export default roleSlice.reducer;
