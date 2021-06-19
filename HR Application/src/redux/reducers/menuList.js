const initialState = {
    menuitem: []
  };
  
  export default function getMenuListReducer(state = initialState, action) {
     
    switch (action.type) {
      case "user/MENULIST":
        return {
          menuitem: action.menuinfo,
        };
      default:
        return state;
    }
  }