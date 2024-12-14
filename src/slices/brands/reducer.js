/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import brandsThunk from './thunk';

const initialState = {
  brands: {},
};

const authSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL BRANDS
      .addCase(brandsThunk.getAllBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      });
  },
});

export default authSlice.reducer;
