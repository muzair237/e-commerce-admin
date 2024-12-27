import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleThunkError } from '@/helpers/common';
import { Toast } from '../../components/Molecules/Toast';
import { Fetch } from '../../helpers/fetchWrapper';
import { CREATE_ROLE, DELETE_ROLE, UPDATE_ROLE, GET_ALL_ROLES } from '../../helpers/url_helper';

const rolesThunk = {
  url: `${process.env.NEXT_PUBLIC_ROLES_API_URL}`,

  getAllRoles: createAsyncThunk(
    'roles/get-all-roles',
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
          `${rolesThunk.url}/${GET_ALL_ROLES}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&startDate=${startDate}&endDate=${endDate}&searchText=${searchText}&sort=${sort}`,
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

  createRole: createAsyncThunk('roles/create-role', async ({ payload }) => {
    try {
      let res = await Fetch.post(`${rolesThunk.url}/${CREATE_ROLE}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'ROle created successfully!',
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

  updateRole: createAsyncThunk('role/update-role', async ({ id, payload }) => {
    try {
      let res = await Fetch.put(`${rolesThunk.url}/${UPDATE_ROLE}/${id}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Role updated successfully!',
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

  deleteRole: createAsyncThunk('roles/delete-role', async ({ id }) => {
    try {
      let res = await Fetch.delete(`${rolesThunk.url}/${DELETE_ROLE}/${id}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        Toast({
          type: 'success',
          message: 'Role deleted successfully!',
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

export default rolesThunk;
