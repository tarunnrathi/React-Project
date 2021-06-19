import { applyMiddleware, createStore, compose } from "redux";
// import { createLogger } from "redux-logger";
// import { composeWithDevTools } from "redux-devtools-extension";
import { autoRehydrate } from "redux-persist";

import rootReducer from "./redux/reducers";
import { persist } from "./services/reduxPersist";

import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import { persistStore, createMigrate } from "redux-persist";

import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const reducer =(state,action)=>{
  //debugger
  if (action.type === 'user/LOGOUT') {
   // storage.removeItem('persist:root'); 
    localStorage.clear('persist:root'); 
    state=undefined
  }
  return rootReducer(state,action);
}

//const persistedReducer = persistReducer(persistConfig, rootReducer);

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer);

// export default () => {
//   let store = store;
//   // let persistor = persistStore(store);
//   return { store, persistor };
// };

export const persistor = persistStore(store);

export default store;
