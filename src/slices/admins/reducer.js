/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import adminThunk from './thunk';

const initialState = {
  admins: {},
  parents: [],
  tableLoading: false,
};

const adminSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL ADMINS
      .addCase(adminThunk.getAllAdmins.pending, state => {
        state.tableLoading = true;
      })
      .addCase(adminThunk.getAllAdmins.fulfilled, (state, action) => {
        state.admins = action.payload;
        state.tableLoading = false;
      })
      .addCase(adminThunk.getAllAdmins.rejected, state => {
        state.tableLoading = false;
      });
  },
});

export default adminSlice.reducer;
