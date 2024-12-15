import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleThunkError } from '@/helpers/common';
import { Fetch } from '../../helpers/fetchWrapper';
import { GET_ALL_BRANDS } from '../../helpers/url_helper';

const brandsThunk = {
  url: `${process.env.NEXT_PUBLIC_BRANDS_API_URL}`,

  getAllBrands: createAsyncThunk('brands/get-all-brands', async ({ page = 1, itemsPerPage = 10, getAll = false }) => {
    try {
      const res = await Fetch.get(
        `${brandsThunk.url}/${GET_ALL_BRANDS}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}`,
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
  }),
};

export default brandsThunk;
