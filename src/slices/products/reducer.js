/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import productsThunk from './thunk';

const initialState = {
  products: {},
  advancedSearchProducts: {},
  productVariants: [],
  tableLoading: false,
  productFilterOptions: {},
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL PRODUCTS
      .addCase(productsThunk.getAllProducts.pending, state => {
        state.tableLoading = true;
      })
      .addCase(productsThunk.getAllProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.tableLoading = false;
      })
      .addCase(productsThunk.getAllProducts.rejected, state => {
        state.tableLoading = false;
      })

      // ADVANCED SEARCH PRODUCTS
      .addCase(productsThunk.advancedProductSearch.fulfilled, (state, action) => {
        state.advancedSearchProducts = action.payload;
      })

      // GET PRODUCT VARIANTS
      .addCase(productsThunk.getProductVariants.fulfilled, (state, action) => {
        state.productVariants = action.payload;
      })

      // GET PRODUCT FILTER OPTIONS
      .addCase(productsThunk.getProductFilterOptions.fulfilled, (state, action) => {
        state.productFilterOptions = action.payload;
      });
  },
});

export default productSlice.reducer;
