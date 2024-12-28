import { combineReducers } from 'redux';

// Layout
import LayoutReducer from './layouts/reducer';

// Auth
import AuthReducer from './auth/reducer';

// Brand
import BrandReducer from './brands/reducer';

// Product
import ProductReducer from './products/reducer';

// Permission
import PermissionReducer from './permissions/reducer';

// Role
import RoleReducer from './roles/reducer';

// Role
import AdminReducer from './admins/reducer';

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Auth: AuthReducer,
  Brand: BrandReducer,
  Product: ProductReducer,
  Permission: PermissionReducer,
  Role: RoleReducer,
  Admin: AdminReducer,
});

export default rootReducer;
