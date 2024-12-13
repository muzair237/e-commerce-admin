import { createAsyncThunk } from '@reduxjs/toolkit';
import { Toast } from '../../components/Molecules/Toast';
import { Fetch } from '../../helpers/fetchWrapper';
import {
  GET_ALL_DASHBOARD_CARDS,
  GET_RECENT_QUERIES,
  GET_TODAY_QUERY_COUNT,
  GET_AGE_GROUPS,
} from '../../helpers/url_helper';

const dashboardThunk = {
  url: `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/dashboard`,

  getDashboardCards: createAsyncThunk('dashboard/getAllDashboardCards', async ({ startDate = '', endDate = '' }) => {
    try {
      let res = await Fetch.get(
        `${dashboardThunk.url}/${GET_ALL_DASHBOARD_CARDS}?startDate=${startDate}&endDate=${endDate}`,
      );
      if (res.status >= 200 && res.status < 300) {
        res = await res.json();
        return res?.analytics;
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

  getRecentQueries: createAsyncThunk('dashboard/getRecentQueries', async ({ page = 1, itemsPerPage = 4 }) => {
    try {
      let res = await Fetch.get(
        `${dashboardThunk.url}/${GET_RECENT_QUERIES}?page=${page}&itemsPerPage=${itemsPerPage}`,
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
  }),

  getTodayQueryCount: createAsyncThunk('dashboard/getTodayQueryCount', async () => {
    try {
      let res = await Fetch.get(`${dashboardThunk.url}/${GET_TODAY_QUERY_COUNT}`);
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
  }),

  getAgeGroups: createAsyncThunk('dashboard/getAgeGroups', async () => {
    try {
      let res = await Fetch.get(`${dashboardThunk.url}/${GET_AGE_GROUPS}`);
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
  }),
};

export default dashboardThunk;
