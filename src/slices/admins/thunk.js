import { createAsyncThunk } from '@reduxjs/toolkit';
import { Toast } from '../../components/Molecules/Toast';
import { Fetch } from '../../helpers/fetchWrapper';
import { GET_ALL_ADMINS, GET_UNIQUE_ROLES, CREATE_ADMIN, EDIT_ADIMN, DELETE_ADMIN } from '../../helpers/url_helper';

const adminThunk = {
  url: `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/admin`,

  getAllAdmins: createAsyncThunk(
    'admin/getAllAdmins',
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
          `${adminThunk.url}/${GET_ALL_ADMINS}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&startDate=${startDate}&endDate=${endDate}&searchText=${searchText}&sort=${sort}&type=${type}`,
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

  getUniqueRoles: createAsyncThunk('admin/getUniqueRoles', async () => {
    try {
      let res = await Fetch.get(`${adminThunk.url}/${GET_UNIQUE_ROLES}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        return res?.uniqueRoles;
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

  createAdmin: createAsyncThunk('admin/createAdmin', async ({ payload, setIsOpen, refetch }) => {
    try {
      let res = await Fetch.post(`${adminThunk.url}/${CREATE_ADMIN}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        refetch(prev => !prev);
        setIsOpen(prev => !prev);
        Toast({
          type: 'success',
          message: 'Admin Created Successfully!',
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

  editAdmin: createAsyncThunk('admin/editAdmin', async ({ id, payload, setIsOpen, refetch }) => {
    try {
      let res = await Fetch.put(`${adminThunk.url}/${EDIT_ADIMN}/${id}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        refetch(prev => !prev);
        setIsOpen(prev => !prev);
        Toast({
          type: 'success',
          message: 'Admin Information Edited Successfully!',
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

  deleteAdmin: createAsyncThunk('admin/deleteAdmin', async ({ adminToDelete, setDeleteModal, refetch }) => {
    try {
      let res = await Fetch.delete(`${adminThunk.url}/${DELETE_ADMIN}/${adminToDelete}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        refetch(prev => !prev);
        setDeleteModal(false);
        Toast({
          type: 'success',
          message: 'Admin Deleted Successfully!',
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

export default adminThunk;
