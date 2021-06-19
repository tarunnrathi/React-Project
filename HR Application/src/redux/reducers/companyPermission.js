const initialState = {
   compperm: {},
  };
  
  export default function companyPermissionReducer(state = initialState, action) {
     
    switch (action.type) {
      case "companyPermission/companyperm":
        return {
          ...state,
          compperm: action.compInfo,
        };
      default:
        return state;
    }
  }