import { combineReducers } from 'redux';

// Layout
import LayoutReducer from './layouts/reducer';

// Auth
import AuthReducer from './auth/reducer';

// Dashboard
import dashboardReducer from './dashboard/reducer';

// Permission
import permissionReducer from './permissions/reducer';

// Role
import roleReducer from './roles/reducer';

// Admin
import adminReducer from './admins/reducer';

// User
import userReducer from './users/reducer';

// Question
import questionReducer from './qnas/reducer';

// Feedback
import feedbackReducer from './feedbacks/reducer';

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Auth: AuthReducer,
  Dashboard: dashboardReducer,
  Permission: permissionReducer,
  Role: roleReducer,
  Admin: adminReducer,
  User: userReducer,
  Question: questionReducer,
  Feedback: feedbackReducer,
});

export default rootReducer;
