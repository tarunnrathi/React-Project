export function setMenuPermission(perminfo) {
  
  return {
    type: "user/MENUPERMISSION",
    perminfo,
  };
}
