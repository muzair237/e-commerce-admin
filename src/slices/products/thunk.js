import { createAsyncThunk } from '@reduxjs/toolkit';

import { handleThunkError } from '@/helpers/common';
import { Fetch } from '../../helpers/fetchWrapper';
import { GET_ALL_PRODUCTS, GET_PRODUCT_FILTER_OPTIONS } from '../../helpers/url_helper';

const productsThunk = {
  url: `${process.env.NEXT_PUBLIC_PRODUCTS_API_URL}`,

  getAllProducts: createAsyncThunk(
    'product/get-all-products',
    async ({
      page = 1,
      itemsPerPage = 10,
      getAll = false,
      startDate = '',
      endDate = '',
      searchText = '',
      sort = '',
    }) => {
      try {
        const res = await Fetch.get(
          `${productsThunk.url}/${GET_ALL_PRODUCTS}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&searchText=${searchText}&startDate=${startDate}&endDate=${endDate}&sort=${sort}`,
        );
        if (res.status >= 200 && res.status < 300) {
          const { data } = await res.json();

          return data;
        }
        const { message } = await res.json();
        throw new Error(message ?? 'Something Went Wrong');
      } catch (error) {
        handleThunkError(error);
        throw error?.message;
      }
    },
  ),

  getProductFilterOptions: createAsyncThunk('product/get-product-filter-options', async () => {
    try {
      const res = await Fetch.get(`${productsThunk.url}/${GET_PRODUCT_FILTER_OPTIONS}`);
      if (res.status >= 200 && res.status < 300) {
        const { data } = await res.json();

        return data;
      }
      const { message } = await res.json();
      throw new Error(message ?? 'Something Went Wrong');
    } catch (error) {
      handleThunkError(error);
      throw error?.message;
    }
  }),
};

export default productsThunk;
