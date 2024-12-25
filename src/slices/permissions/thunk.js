import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleThunkError } from '@/helpers/common';
import { Toast } from '../../components/Molecules/Toast';
import { Fetch } from '../../helpers/fetchWrapper';
import {
  GET_ALL_PERMISSIONS,
  CREATE_PERMISSION,
  GET_UNIQUE_PARENTS,
  DELETE_PERMISSION,
  EDIT_PERMISSION,
} from '../../helpers/url_helper';

const permissionThunk = {
  url: `${process.env.NEXT_PUBLIC_PERMISSIONS_API_URL}`,

  getAllPermissions: createAsyncThunk(
    'permissions/get-all-permissions',
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
        let res = await Fetch.get(
          `${permissionThunk.url}/${GET_ALL_PERMISSIONS}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&startDate=${startDate}&endDate=${endDate}&searchText=${searchText}&sort=${sort}`,
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

  getUniqueParents: createAsyncThunk('permissions/getUniqueParents', async () => {
    try {
      let res = await Fetch.get(`${permissionThunk.url}/${GET_UNIQUE_PARENTS}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();

        return res?.parentPermissions;
      }
      const { message } = await res.json();
      throw new Error(message ?? 'Something Went Wrong');
    } catch (error) {
      handleThunkError(error);
      throw error?.message;
    }
  }),

  createPermission: createAsyncThunk('permissions/create-permission', async ({ payload }) => {
    try {
      let res = await Fetch.post(`${permissionThunk.url}/${CREATE_PERMISSION}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Permission created successfully!',
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

  updatePermission: createAsyncThunk('permissions/update-permission', async ({ id, payload }) => {
    try {
      let res = await Fetch.put(`${permissionThunk.url}/${EDIT_PERMISSION}/${id}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Permission updated Successfully!',
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

  deletePermission: createAsyncThunk('permissions/delete-permission', async ({ id }) => {
    try {
      let res = await Fetch.delete(`${permissionThunk.url}/${DELETE_PERMISSION}/${id}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Permission deleted successfully!',
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

export default permissionThunk;
