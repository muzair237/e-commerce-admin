import { createAsyncThunk } from '@reduxjs/toolkit';

import { handleThunkError } from '@/helpers/common';
import { Toast } from '@/components/Molecules/Toast';
import { Fetch } from '../../helpers/fetchWrapper';
import { GET_ALL_BRANDS, CREATE_BRAND, UPDATE_BRAND, DELETE_BRAND } from '../../helpers/url_helper';

const brandsThunk = {
  url: `${process.env.NEXT_PUBLIC_BRANDS_API_URL}`,

  getAllBrands: createAsyncThunk(
    'brand/get-all-brands',
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
            brandsThunk.url
          }/${GET_ALL_BRANDS}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&searchText=${encodeURIComponent(
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

  createBrand: createAsyncThunk('brand/createBrand', async ({ payload }) => {
    try {
      let res = await Fetch.upload(`${brandsThunk.url}/${CREATE_BRAND}`, 'POST', payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Brand created successfully!',
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

  updateBrand: createAsyncThunk('brand/updateBrand', async ({ id, payload }) => {
    try {
      let res = await Fetch.upload(`${brandsThunk.url}/${UPDATE_BRAND}/${id}`, 'PUT', payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Brand updated successfully!',
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

  deleteBrand: createAsyncThunk('brand/deleteBrand', async ({ id }) => {
    try {
      let res = await Fetch.delete(`${brandsThunk.url}/${DELETE_BRAND}/${id}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Brand deleted successfully!',
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

export default brandsThunk;
