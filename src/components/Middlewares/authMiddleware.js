import { setSessionExpiredModalState } from '@/slices/auth/reducer';

const authMiddleware = store => next => action => {
  if (
    ['401 Unauthorized', 'jwt expired'].includes(action?.error?.message) &&
    action?.type !== 'auth/loginUser/rejected'
  ) {
    store.dispatch(setSessionExpiredModalState());
  }

  return next(action);
};

export default authMiddleware;
