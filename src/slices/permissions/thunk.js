import { createAsyncThunk } from '@reduxjs/toolkit';
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
  url: `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/permission`,

  getAllPermissions: createAsyncThunk(
    'permission/getAllPermissions',
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
          `${permissionThunk.url}/${GET_ALL_PERMISSIONS}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&startDate=${startDate}&endDate=${endDate}&searchText=${searchText}&sort=${sort}&type=${type}`,
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

  getUniqueParents: createAsyncThunk('permission/getUniqueParents', async () => {
    try {
      let res = await Fetch.get(`${permissionThunk.url}/${GET_UNIQUE_PARENTS}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        return res?.parentPermissions;
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

  createPermission: createAsyncThunk('permission/addPermission', async ({ payload, setIsOpen, refetch }) => {
    try {
      let res = await Fetch.post(`${permissionThunk.url}/${CREATE_PERMISSION}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        refetch(prev => !prev);
        setIsOpen(prev => !prev);
        Toast({
          type: 'success',
          message: 'Permission Created Successfully!',
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

  editPermission: createAsyncThunk('permission/editPermission', async ({ id, payload, setIsOpen, refetch }) => {
    try {
      let res = await Fetch.put(`${permissionThunk.url}/${EDIT_PERMISSION}/${id}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        refetch(prev => !prev);
        setIsOpen(prev => !prev);
        Toast({
          type: 'success',
          message: 'Permission Edited Successfully!',
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

  deletePermission: createAsyncThunk(
    'permission/deletePermission',
    async ({ permissionToDelete, setDeleteModal, refetch }) => {
      try {
        let res = await Fetch.delete(`${permissionThunk.url}/${DELETE_PERMISSION}/${permissionToDelete}`);
        if (res.status >= 200 && res.status < 300) {
          res = await res.json();
          refetch(prev => !prev);
          setDeleteModal(false);
          Toast({
            type: 'success',
            message: 'Permission Deleted Successfully!',
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
    },
  ),
};

export default permissionThunk;
