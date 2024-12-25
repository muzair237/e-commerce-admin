import { combineReducers } from 'redux';

// Layout
import LayoutReducer from './layouts/reducer';

// Auth
import AuthReducer from './auth/reducer';

// Brand
import BrandReducer from './brands/reducer';

// Product
import ProductReducer from './products/reducer';

// Product
import PermissionReducer from './permissions/reducer';

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Auth: AuthReducer,
  Brand: BrandReducer,
  Product: ProductReducer,
  Permission: PermissionReducer,
});

export default rootReducer;
