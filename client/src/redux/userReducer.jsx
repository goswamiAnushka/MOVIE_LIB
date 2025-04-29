/*const initialState = {
    user: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case "USER_LOGIN":
        return {
          ...state,
          user: action.payload,
        };
      case "USER_LOGOUT":
        return {
          ...state,
          user: null,
        };
      default:
        return state;
    }
  };
  
  export const userLogin = (user) => ({
    type: "USER_LOGIN",
    payload: user,
  });
  
  export const userLogout = () => ({
    type: "USER_LOGOUT",
  });
  
  export default userReducer;*/