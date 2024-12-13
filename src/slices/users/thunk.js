import { createAsyncThunk } from '@reduxjs/toolkit';
import { Toast } from '../../components/Molecules/Toast';
import { Fetch } from '../../helpers/fetchWrapper';
import { GET_ALL_USERS } from '../../helpers/url_helper';

const userThunk = {
  url: `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/user`,

  getAllUsers: createAsyncThunk(
    'user/getAllUsers',
    async ({
      page = 1,
      itemsPerPage = 10,
      getAll = false,
      startDate = '',
      endDate = '',
      searchText = '',
      sort = '',
      type = '',
    }) => {
      try {
        let res = await Fetch.get(
          `${userThunk.url}/${GET_ALL_USERS}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&startDate=${startDate}&endDate=${endDate}&searchText=${searchText}&sort=${sort}&type=${type}`,
        );
        if (res.status >= 200 && res.status < 300) {
          res = await res.json();
          return res;
        }
        const { message } = await res.json();
        throw new Error(message ?? 'Something Went Wrong');
      } catch ({ message }) {
        Toast({
          type: 'error',
          message,
        });
        throw message;
      }
    },
  ),
};

export default userThunk;
