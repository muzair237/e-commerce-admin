import { setSessionExpiredModalState } from '@/slices/auth/reducer';

const authMiddleware = store => next => action => {
  if (action.type.endsWith('failed') && action.error.message === '401 Unauthorized') {
    console.log('I am in authMiddleware');
    store.dispatch(setSessionExpiredModalState());
  }

  return next(action);
};

export default authMiddleware;
