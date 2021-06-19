const initialState = {
  perm: {},
};

export default function userEditReducer(state = initialState, action) {
 
  switch (action.type) {
    case "user/EDIT":
      return {
        userInfo: action.userInfo,
      };
    default:
      return state;
  }
}
