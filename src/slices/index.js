import { combineReducers } from 'redux';

// Layout
import LayoutReducer from './layouts/reducer';

// Auth
import AuthReducer from './auth/reducer';

// Brand
import BrandReducer from './brands/reducer';

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Auth: AuthReducer,
  Brand: BrandReducer,
});

export default rootReducer;
