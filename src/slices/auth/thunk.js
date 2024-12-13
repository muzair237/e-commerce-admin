import { createAsyncThunk } from '@reduxjs/toolkit';
import { Toast } from '../../components/Molecules/Toast';
import { setCookie, clearAllCookies } from '../../helpers/common';
import { Fetch } from '../../helpers/fetchWrapper';
import { LOGIN, LOGOUT, ME } from '../../helpers/url_helper';

const authThunk = {
  url: `${process.env.NEXT_PUBLIC_AUTH_API_URL}`,

  login: createAsyncThunk('auth/loginUser', async ({ payload, router }) => {
    try {
      const res = await Fetch.post(`${authThunk.url}/${LOGIN}`, payload);
      if (res.status >= 200 && res.status < 300) {
        const { token, message } = await res.json();
        setCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE, JSON.stringify(token));
        Toast({
          type: 'success',
          message,
        });
        router.push('/dashboard');

        return;
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

  me: createAsyncThunk('auth/me', async () => {
    try {
      const res = await Fetch.get(`${authThunk.url}/${ME}`);
      if (res.status >= 200 && res.status < 300) {
        const { data } = await res.json();
        data.allowedPages = [
          ...(data?.permissions?.filter(p => p.includes('.nav')) || []).map(p => `/${p.split('.')[0]}`),
        ];

        setCookie(process.env.NEXT_PUBLIC_ADMIN_ALLOWED_PAGES_COOKIE, JSON.stringify(data.allowedPages));

        return data;
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

  logout: createAsyncThunk('auth/logoutUser', async ({ router }) => {
    try {
      await Fetch.get(`${authThunk.url}/${LOGOUT}`);
      clearAllCookies();
      localStorage.clear();
      router.push('/login');
      Toast({
        type: 'success',
        message: 'Logged Out Successfully!',
      });
    } catch {
      Toast({
        type: 'error',
        message: 'Something Went Wrong',
      });
      throw new Error('Something Went Wrong');
    }
  }),
};

export default authThunk;
