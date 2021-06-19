export function login(userInfo) {
 return {
    type: "user/LOGIN",
    userInfo,
  };
}
export function userInfo(userInfo) {
 console.log("user ifnpppp 10 line");
  return {
    type: "user/EDIT",
    userInfo,
  };
}

