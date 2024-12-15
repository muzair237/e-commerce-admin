import { setSessionExpiredModalState } from '@/slices/auth/reducer';

const authMiddleware = store => next => action => {
  if (['401 Unauthorized', 'jwt expired'].includes(action?.error?.message)) {
    store.dispatch(setSessionExpiredModalState());
  }

  return next(action);
};

export default authMiddleware;
