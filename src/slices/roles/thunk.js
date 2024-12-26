import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleThunkError } from '@/helpers/common';
import { Toast } from '../../components/Molecules/Toast';
import { Fetch } from '../../helpers/fetchWrapper';
import { GET_ALL_ROLES } from '../../helpers/url_helper';

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

  //   createPermission: createAsyncThunk('permissions/create-permission', async ({ payload }) => {
  //     try {
  //       let res = await Fetch.post(`${rolesThunk.url}/${CREATE_PERMISSION}`, payload);
  //       if (res.status >= 200 && res.status < 300) {
  //         res = await res.json();
  //         Toast({
  //           type: 'success',
  //           message: 'Permission created successfully!',
  //         });

  //         return res;
  //       }
  //       const { message } = await res.json();
  //       throw new Error(message ?? 'Something Went Wrong');
  //     } catch (error) {
  //       handleThunkError(error);
  //       throw error?.message;
  //     }
  //   }),

  //   updatePermission: createAsyncThunk('permissions/update-permission', async ({ id, payload }) => {
  //     try {
  //       let res = await Fetch.put(`${rolesThunk.url}/${EDIT_PERMISSION}/${id}`, payload);
  //       if (res.status >= 200 && res.status < 300) {
  //         res = await res.json();
  //         Toast({
  //           type: 'success',
  //           message: 'Permission updated Successfully!',
  //         });

  //         return res;
  //       }
  //       const { message } = await res.json();
  //       throw new Error(message ?? 'Something Went Wrong');
  //     } catch (error) {
  //       handleThunkError(error);
  //       throw error?.message;
  //     }
  //   }),

  //   deletePermission: createAsyncThunk('permissions/delete-permission', async ({ id }) => {
  //     try {
  //       let res = await Fetch.delete(`${rolesThunk.url}/${DELETE_PERMISSION}/${id}`);
  //       if (res.status >= 200 && res.status < 300) {
  //         res = await res.json();
  //         Toast({
  //           type: 'success',
  //           message: 'Permission deleted successfully!',
  //         });

  //         return res;
  //       }
  //       const { message } = await res.json();
  //       throw new Error(message ?? 'Something Went Wrong');
  //     } catch (error) {
  //       handleThunkError(error);
  //       throw error?.message;
  //     }
  //   }),
};

export default rolesThunk;
