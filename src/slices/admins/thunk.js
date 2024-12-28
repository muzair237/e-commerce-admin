import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleThunkError } from '@/helpers/common';
import { Toast } from '../../components/Molecules/Toast';
import { Fetch } from '../../helpers/fetchWrapper';
import { CREATE_ADMIN, DELETE_ADMIN, GET_ALL_ADMINS, UPDATE_ADIMN, UPDATE_PASSWORD } from '../../helpers/url_helper';

const adminThunk = {
  url: `${process.env.NEXT_PUBLIC_ADMINS_API_URL}`,

  getAllAdmins: createAsyncThunk(
    'admins/get-all-admins',
    async ({
      page = 1,
      itemsPerPage = 10,
      getAll = false,
      startDate = '',
      endDate = '',
      searchText = '',
      sort = '',
      roleType = '',
    }) => {
      try {
        let res = await Fetch.get(
          `${adminThunk.url}/${GET_ALL_ADMINS}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&startDate=${startDate}&endDate=${endDate}&searchText=${searchText}&sort=${sort}&roleType=${roleType}`,
        );
        if (res.status >= 200 && res.status < 300) {
          res = await res.json();

          return res?.data;
        }
        const { message } = await res.json();
        throw new Error(message ?? 'Something Went Wrong');
      } catch (error) {
        handleThunkError(error);
        throw error?.message;
      }
    },
  ),

  createAdmin: createAsyncThunk('admins/create-admin', async ({ payload }) => {
    try {
      let res = await Fetch.post(`${adminThunk.url}/${CREATE_ADMIN}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Admin created Successfully!',
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

  updateAdmin: createAsyncThunk('admins/update-admin', async ({ id, payload }) => {
    try {
      let res = await Fetch.patch(`${adminThunk.url}/${UPDATE_ADIMN}/${id}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Admin updated Successfully!',
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

  updatePassword: createAsyncThunk('admins/update-password', async ({ id, payload }) => {
    try {
      let res = await Fetch.patch(`${adminThunk.url}/${UPDATE_PASSWORD}/${id}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Password updated Successfully!',
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

  deleteAdmin: createAsyncThunk('admins/delete-admin', async ({ id }) => {
    try {
      let res = await Fetch.delete(`${adminThunk.url}/${DELETE_ADMIN}/${id}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Admin deleted successfully!',
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

export default adminThunk;
