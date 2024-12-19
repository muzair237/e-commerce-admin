import { useSelector } from 'react-redux';
import { Toast } from '@/components/Molecules/Toast';

export const GetCurrentAppearanceState = () => {
  const { layoutModeType } = useSelector(state => state?.Layout);

  return layoutModeType;
};

export const getSkeletonStyle = () => {
  const appearance = GetCurrentAppearanceState();

  return appearance === 'dark'
    ? { backgroundColor: '#5f6368', color: '#a3a3a3' }
    : { backgroundColor: '#e5f3f8', color: '#92c9d7' };
};

export const setCookie = (name, value, domain, days) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  const domainString = domain ? `; domain=${domain}` : '';
  document.cookie = `${name}=${value || ''}${expires}; path=/${domainString}`;

  return true;
};

export const getCookie = name => {
  const nameEQ = `${name}=`;
  const ca = typeof document !== 'undefined' && document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }

  return null;
};

export const clearCookie = name => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  return true;
};

export const clearMyBrowserData = () => {
  clearCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE);
  clearCookie(process.env.NEXT_PUBLIC_ADMIN_ALLOWED_PAGES_COOKIE);
};

export const greetings = () => {
  const currentHour = new Date().getHours();

  return currentHour >= 4 && currentHour < 12
    ? 'Good Morning'
    : currentHour >= 12 && currentHour < 18
    ? 'Good Afternoon'
    : currentHour >= 18 && currentHour < 21
    ? 'Good Evening'
    : 'Good Night';
};

export const handleThunkError = ({ message }) => {
  if (!['401 Unauthorized', 'jwt expired'].includes(message)) {
    Toast({
      type: 'error',
      message,
    });
  }
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export const handleApiCall = async (dispatch, action, params) => {
  try {
    const response = await dispatch(action(params));

    return response?.meta?.requestStatus === 'fulfilled';
  } catch (error) {
    console.error('API call failed:', error);

    return false;
  }
};

export const convertToFormData = obj => {
  const formData = new FormData();

  Object.keys(obj).forEach(key => {
    const value = obj[key];

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (value && (typeof value === 'object' || Array.isArray(value))) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};
