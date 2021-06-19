const initialState = {
  //perm: {},
  perm: []
};

export default function menuReducerPermission(state = initialState, action) {
   //debugger
  switch (action.type) {
    case "user/MENUPERMISSION":
      return {
        perm: action.perminfo,
      };
    default:
      return state;
  }
}
