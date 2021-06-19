import { combineReducers } from "redux";

import user from "./user";
import menu from "./menu";
import menuPermission from "./menuPermission";
import userEdit from "./userEdit";
import companyPermission from "./companyPermission";
import logoutReducer from "./logout"
import menuList from "./menuList"
import controls from "./controlPermission";

const appReducer = combineReducers({
  user,
  menu,
  menuPermission,
  userEdit,
  companyPermission,
  logoutReducer,
  menuList,
  controls
});

const rootReducer = (state, action) => {
  if (action.type === "user/LOGOUT")
      state = undefined;
  return appReducer(state, action);
};
export default rootReducer;
