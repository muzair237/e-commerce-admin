import { createAsyncThunk } from '@reduxjs/toolkit';
import { Toast } from '../../components/Molecules/Toast';
import { Fetch } from '../../helpers/fetchWrapper';
import { GET_ALL_ROLES, CREATE_ROLE, EDIT_ROLE, DELETE_ROLE, GET_PERMISSIONS } from '../../helpers/url_helper';

const roleThunk = {
  url: `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/role`,

  getAllRoles: createAsyncThunk(
    'role/getAllRoles',
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
          `${roleThunk.url}/${GET_ALL_ROLES}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&startDate=${startDate}&endDate=${endDate}&searchText=${searchText}&sort=${sort}`,
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

  getUniqueParents: createAsyncThunk('role/getUniqueParents', async () => {
    try {
      let res = await Fetch.get(`${roleThunk.url}/${GET_PERMISSIONS}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        return res?.permissions;
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
  }),

  createRole: createAsyncThunk('role/createRole', async ({ payload, setIsOpen, refetch }) => {
    try {
      let res = await Fetch.post(`${roleThunk.url}/${CREATE_ROLE}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        refetch(prev => !prev);
        setIsOpen(prev => !prev);
        Toast({
          type: 'success',
          message: 'Role Created Successfully!',
        });
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
  }),

  editRole: createAsyncThunk('role/editRole', async ({ id, payload, setIsOpen, refetch }) => {
    try {
      let res = await Fetch.put(`${roleThunk.url}/${EDIT_ROLE}/${id}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        refetch(prev => !prev);
        setIsOpen(prev => !prev);
        Toast({
          type: 'success',
          message: 'Role Edited Successfully!',
        });
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
  }),

  deleteRole: createAsyncThunk('role/deleteRole', async ({ roleToDelete, setDeleteModal, refetch }) => {
    try {
      let res = await Fetch.delete(`${roleThunk.url}/${DELETE_ROLE}/${roleToDelete}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        refetch(prev => !prev);
        setDeleteModal(false);
        Toast({
          type: 'success',
          message: 'Role Deleted Successfully!',
        });
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
  }),
};

export default roleThunk;
