/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoIosInformationCircleOutline } from 'react-icons/io';

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

export const convertToFormData = data => {
  const formData = new FormData();

  const appendData = (obj, parentKey = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${fullKey}[${index}]`, item);
          } else if (typeof item === 'object' && item !== null) {
            appendData(item, `${fullKey}[${index}]`);
          } else {
            formData.append(`${fullKey}[${index}]`, item);
          }
        });
      } else if (value instanceof File) {
        formData.append(fullKey, value);
      } else if (typeof value === 'object' && value !== null) {
        appendData(value, fullKey);
      } else {
        formData.append(fullKey, value);
      }
    });
  };

  appendData(data);

  return formData;
};

export const prepareProductFiltersData = (data = {}) => {
  const brandOptions = data?.brandOptions?.map(item => ({
    label: item?.name,
    value: item?.id,
  }));

  const screenSizeOptions = Object.keys(data?.screenSizes || {}).map(key => ({
    label: data?.screenSizes[key],
    value: key,
  }));

  const ramOptions = Object.keys(data?.ramOptions || {}).map(key => ({
    label: data?.ramOptions[key],
    value: key,
  }));

  const storageTypeOptions = Object.keys(data?.storageTypeOptions || {}).map(key => ({
    label: data?.storageTypeOptions[key],
    value: key,
  }));

  const storageSizeOptions = Object.keys(data?.storageSizeOptions || {}).map(key => ({
    label: data?.storageSizeOptions[key],
    value: key,
  }));

  const processorNameOptions = Object.keys(data?.processorNameoptions || {}).map(key => ({
    label: data?.processorNameoptions[key],
    value: key,
  }));

  const processorGenOptions = Object.keys(data?.processorGenOptions || {}).map(key => ({
    label: data?.processorGenOptions[key],
    value: key,
  }));

  const graphicsCardTypeOptions = Object.keys(data?.graphicsCardTypeOptions || {}).map(key => ({
    label: data?.graphicsCardTypeOptions[key],
    value: key,
  }));

  const graphicsCardMemorySizes = Object.keys(data?.graphicsCardMemorySizes || {}).map(key => ({
    label: data?.graphicsCardMemorySizes[key],
    value: key,
  }));

  return {
    brandOptions,
    screenSizeOptions,
    ramOptions,
    storageTypeOptions,
    storageSizeOptions,
    processorNameOptions,
    processorGenOptions,
    graphicsCardTypeOptions,
    graphicsCardMemorySizes,
  };
};

export const traverseAndModifyObject = (obj = {}) => {
  const result = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value && typeof value === 'object' && Object.hasOwnProperty.call(value, 'label')) {
      result[key] = value.label;
    } else if (typeof value !== 'object') {
      result[key] = value;
    }
  });

  return result;
};

export const getNestedValue = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

export const giveIcon = ({ type }) => {
  const iconSize = 70;
  switch (type) {
    case 'delete':
      return <AiOutlineDelete color="red" size={iconSize} />;
    default:
      return <IoIosInformationCircleOutline color="pink" size={iconSize} />;
  }
};

export const isObjectEmptyOrFieldsNull = obj =>
  Object.keys(obj)?.length <= 0 ||
  Object.values(obj).every(value => value === null || value === undefined || value === '');
