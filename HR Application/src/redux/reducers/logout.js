export default function logoutReducer(state=null,action){
  
    switch(action.type){
        case "user/LOGOUT":
           // state="";
            return null
        default :return state
    }

}