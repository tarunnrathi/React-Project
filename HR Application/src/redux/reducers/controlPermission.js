const initialState={
    controlsItem:[]
};


export default function ControlItemsReducer(state=initialState,action) {
  
    switch (action.type) {
        case "user/ControlPermission":
            return{
                controlsItem:action.controlsInfo
            }    
        default:
            return state;
    }
    
}