export const UserReducer = (state, action) => {
  switch (action.type) {
    case "NEW_PASSWORD_REQUIRED":
      return {
        ...state,
        user: action.user,
      };
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        user: action.user,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.user,
      };
    case "CHECK_LOGIN_SUCCESS":
      return {
        ...state,
        user: action.user,
      };
    case "SIGNUP_FAIL":
    case "LOGIN_FAIL":
    case "CHECK_LOGIN_FAIL":
    case "LOGOUT_FAIL":
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};