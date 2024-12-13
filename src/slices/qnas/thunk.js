import { createAsyncThunk } from '@reduxjs/toolkit';
import { Toast } from '../../components/Molecules/Toast';
import { Fetch } from '../../helpers/fetchWrapper';
import { GET_ALL_QUESTIONS, CREATE_QUESTION, EDIT_QUESTION, DELETE_QUESTION } from '../../helpers/url_helper';

const questionThunk = {
  url: `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/QnA`,

  getAllQuestions: createAsyncThunk(
    'question/getAllQuestions',
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
          `${questionThunk.url}/${GET_ALL_QUESTIONS}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&startDate=${startDate}&endDate=${endDate}&searchText=${searchText}&sort=${sort}`,
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

  createQuestion: createAsyncThunk('question/createQuestion', async ({ payload, setIsOpen, refetch }) => {
    try {
      let res = await Fetch.post(`${questionThunk.url}/${CREATE_QUESTION}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        refetch(prev => !prev);
        setIsOpen(prev => !prev);
        Toast({
          type: 'success',
          message: 'Question Created Successfully!',
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

  editQuestion: createAsyncThunk('question/editQuestion', async ({ id, payload, setIsOpen, refetch }) => {
    try {
      let res = await Fetch.put(`${questionThunk.url}/${EDIT_QUESTION}/${id}`, payload);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        refetch(prev => !prev);
        setIsOpen(prev => !prev);
        Toast({
          type: 'success',
          message: 'Question Edited Successfully!',
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

  deleteQuestion: createAsyncThunk('question/deleteQuestion', async ({ quesToDelete, setDeleteModal, refetch }) => {
    try {
      let res = await Fetch.delete(`${questionThunk.url}/${DELETE_QUESTION}/${quesToDelete}`);
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        refetch(prev => !prev);
        setDeleteModal(false);
        Toast({
          type: 'success',
          message: 'Question Deleted Successfully!',
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

export default questionThunk;
