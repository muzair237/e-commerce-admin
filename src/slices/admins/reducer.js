import { createSlice } from '@reduxjs/toolkit';
import adminThunk from './thunk';

const initialState = {
  admins: {},
  roles: [],
  isLoading: false,
  errorMsg: '',
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL ADMINS
      .addCase(adminThunk.getAllAdmins.pending, state => {
        state.isLoading = true;
      })
      .addCase(adminThunk.getAllAdmins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admins = action?.payload;
      })
      .addCase(adminThunk.getAllAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      })

      // GET UNIQUE ROLES
      .addCase(adminThunk.getUniqueRoles.fulfilled, (state, action) => {
        state.roles = action?.payload;
      })
      .addCase(adminThunk.getUniqueRoles.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
      })

      // CREATE ADMIN
      .addCase(adminThunk.createAdmin.pending, state => {
        state.isLoading = true;
      })
      .addCase(adminThunk.createAdmin.fulfilled, state => {
        state.isLoading = false;
      })

      .addCase(adminThunk.createAdmin.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
        state.isLoading = false;
      })

      // EDIT ADMIN
      .addCase(adminThunk.editAdmin.pending, state => {
        state.isLoading = true;
      })
      .addCase(adminThunk.editAdmin.fulfilled, state => {
        state.isLoading = false;
      })

      .addCase(adminThunk.editAdmin.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
        state.isLoading = false;
      })

      // DELETE ADMIN
      .addCase(adminThunk.deleteAdmin.pending, state => {
        state.isLoading = true;
      })
      .addCase(adminThunk.deleteAdmin.fulfilled, state => {
        state.isLoading = false;
      })

      .addCase(adminThunk.deleteAdmin.rejected, (state, action) => {
        state.errorMsg = action?.error?.message;
        state.isLoading = false;
      });
  },
});

export default adminSlice.reducer;
