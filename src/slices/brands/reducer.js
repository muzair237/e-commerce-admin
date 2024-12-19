/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import brandsThunk from './thunk';

const initialState = {
  brands: {},
  tableLoading: false,
};

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL BRANDS
      .addCase(brandsThunk.getAllBrands.pending, state => {
        state.tableLoading = true;
      })
      .addCase(brandsThunk.getAllBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
        state.tableLoading = false;
      })
      .addCase(brandsThunk.getAllBrands.rejected, state => {
        state.tableLoading = false;
      });
  },
});

export default brandSlice.reducer;
