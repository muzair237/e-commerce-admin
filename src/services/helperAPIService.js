import { Fetch } from '@/helpers/fetchWrapper';
import { handleThunkError } from '@/helpers/common';
import { GET_ALL_BRANDS } from '../helpers/url_helper';

const helperService = {
  getAllBrands: async ({ getAll = false, searchText = '' }) => {
    try {
      const res = await Fetch.get(
        `${process.env.NEXT_PUBLIC_BRANDS_API_URL}/${GET_ALL_BRANDS}?getAll=${getAll}&searchText=${encodeURIComponent(
          searchText.trim(),
        )}`,
      );
      if (res.status >= 200 && res.status < 300) {
        const { data } = await res.json();

        return data?.items;
      }
      const { message } = await res.json();
      throw new Error(message ?? 'Something Went Wrong');
    } catch (error) {
      handleThunkError(error);
      throw error?.message;
    }
  },
};

export default helperService;
