const initialState = {
  menuId: 4,
};

export default function menuReducer(state = initialState, action) {
  
  switch (action.type) {
    case "user/MENU":
      return {
        menuId: action.menuId,
      };
    default:
      return state;
  }
}
