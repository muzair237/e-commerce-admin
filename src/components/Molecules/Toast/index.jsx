// toastUtils.js
import toast from 'react-hot-toast';

export const Toast = ({ type, message }) => {
  switch (type) {
    case 'success':
      return toast.success(message, {
        style: {
          background: '#f2f9f0',
          color: '#53b13e',
        },
      });
    case 'error':
      return toast.error(message, {
        style: {
          background: '#fef0f4',
          color: '#B10000',
        },
      });
    default:
      return toast(message);
  }
};
