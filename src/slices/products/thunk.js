import { createAsyncThunk } from '@reduxjs/toolkit';

import { handleThunkError } from '@/helpers/common';
import { Toast } from '@/components/Molecules/Toast';
import { Fetch } from '../../helpers/fetchWrapper';
import {
  GET_ALL_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  ADVANCED_PRODUCT_SEARCH,
  GET_PRODUCT_VARIANTS,
  GET_PRODUCT_FILTER_OPTIONS,
  CREATE_PRODUCT_VARIANT,
  UPDATE_PRODUCT_VARIANT,
  DELETE_PRODUCT_VARIANT,
} from '../../helpers/url_helper';

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
          `${
            productsThunk.url
          }/${GET_ALL_PRODUCTS}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&searchText=${encodeURIComponent(
            searchText.trim(),
          )}&startDate=${startDate}&endDate=${endDate}&sort=${sort}`,
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

  createProduct: createAsyncThunk('product/create-product', async ({ payload }) => {
    try {
      let res = await Fetch.upload(`${productsThunk.url}/${CREATE_PRODUCT}`, 'POST', payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Product created successfully!',
        });

        return res;
      }
      const { message } = await res.json();
      throw new Error(message ?? 'Something Went Wrong');
    } catch (error) {
      handleThunkError(error);
      throw error?.message;
    }
  }),

  updateProduct: createAsyncThunk('product/update-product', async ({ id, payload }) => {
    try {
      let res = await Fetch.upload(`${productsThunk.url}/${UPDATE_PRODUCT}/${id}`, 'PUT', payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Product updated successfully!',
        });

        return res;
      }
      const { message } = await res.json();
      throw new Error(message ?? 'Something Went Wrong');
    } catch (error) {
      handleThunkError(error);
      throw error?.message;
    }
  }),

  advancedProductSearch: createAsyncThunk('product/advanced-product-search', async ({ payload }) => {
    try {
      const res = await Fetch.post(`${productsThunk.url}/${ADVANCED_PRODUCT_SEARCH}`, payload);
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

  getProductVariants: createAsyncThunk('product/get-product-variants', async ({ id }) => {
    try {
      const res = await Fetch.get(`${productsThunk.url}/${GET_PRODUCT_VARIANTS}/${id}`);
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

  createProductVariant: createAsyncThunk('product/create-product-variant', async ({ id, payload }) => {
    try {
      let res = await Fetch.post(`${productsThunk.url}/${CREATE_PRODUCT_VARIANT}/${id}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Variant created successfully!',
        });

        return res;
      }
      const { message } = await res.json();
      throw new Error(message ?? 'Something Went Wrong');
    } catch (error) {
      handleThunkError(error);
      throw error?.message;
    }
  }),

  updateProductVariant: createAsyncThunk('product/update-product-variant', async ({ id, payload }) => {
    try {
      let res = await Fetch.put(`${productsThunk.url}/${UPDATE_PRODUCT_VARIANT}/${id}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Variant updated successfully!',
        });

        return res;
      }
      const { message } = await res.json();
      throw new Error(message ?? 'Something Went Wrong');
    } catch (error) {
      handleThunkError(error);
      throw error?.message;
    }
  }),

  deleteProductVariant: createAsyncThunk('product/delete-product-variant', async ({ id }) => {
    try {
      let res = await Fetch.delete(`${productsThunk.url}/${DELETE_PRODUCT_VARIANT}/${id}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Variant deleted successfully!',
        });

        return res;
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
