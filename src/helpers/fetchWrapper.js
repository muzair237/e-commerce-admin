import { getCookie, clearAllCookies } from './common';

let trigger = false;
function handleResponse(response) {
  if (response.status === 401 && !trigger && getCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE)) {
    trigger = true;
    clearAllCookies();
    window.location.reload();
  }
  return response;
}

async function get(url) {
  const headers = {
    'Content-Type': 'application/json',
    authorization: `Bearer ${JSON.parse(getCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE))}`,
  };
  const requestOptions = {
    method: 'GET',
    headers,
  };

  return fetch(url, requestOptions).then(res => handleResponse(res));
}

async function post(url, body) {
  const headers = {
    'Content-Type': 'application/json',
    authorization: `Bearer ${JSON.parse(getCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE))}`,
  };

  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  };

  return fetch(url, requestOptions).then(res => handleResponse(res));
}

async function upload(url, method, body) {
  const headers = {
    // 'Content-Type': 'multipart/form-data',
    authorization: `Bearer ${JSON.parse(getCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE))}`,
  };

  const requestOptions = {
    method,
    headers,
    body,
  };

  return fetch(url, requestOptions).then(res => handleResponse(res));
}

async function put(url, body) {
  const headers = {
    'Content-Type': 'application/json',
    authorization: `Bearer ${JSON.parse(getCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE))}`,
  };
  const requestOptions = {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  };

  return fetch(url, requestOptions).then(res => handleResponse(res));
}

async function _delete(url, body) {
  const headers = {
    'Content-Type': 'application/json',
    authorization: `Bearer ${JSON.parse(getCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE))}`,
  };
  const requestOptions = {
    method: 'DELETE',
    headers,
    body: JSON.stringify(body),
  };

  return fetch(url, requestOptions).then(res => handleResponse(res));
}

async function patch(url, body) {
  const headers = {
    'Content-Type': 'application/json',
    authorization: `Bearer ${JSON.parse(getCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE))}`,
  };
  const requestOptions = {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  };

  return fetch(url, requestOptions).then(res => handleResponse(res));
}

export const Fetch = {
  get,
  post,
  put,
  delete: _delete,
  patch,
  upload,
};
