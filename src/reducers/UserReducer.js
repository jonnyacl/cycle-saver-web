import axios from 'axios';

export const UserReducer = (state, action) => {
  switch (action.type) {
    case "SIGNUP_SUCCESS":
      axios.defaults.headers["Authorization"] = `Bearer ${action.user.idToken}`;
      return {
        ...state,
        user: action.user.signedInUser,
        token: action.user.idToken,
      };
    case "LOGIN_SUCCESS":
      axios.defaults.headers["Authorization"] = `Bearer ${action.user.idToken}`;
      return {
        ...state,
        user: action.user.signedInUser,
        token: action.user.idToken,
      };
    case "CHECK_LOGIN_SUCCESS":
      axios.defaults.headers["Authorization"] = `Bearer ${action.user.idToken}`;
      return {
        ...state,
        user: action.user.signedInUser,
        token: action.user.idToken,
      };
    case "SIGNUP_FAIL":
    case "LOGIN_FAIL":
    case "CHECK_LOGIN_FAIL":
    case "LOGOUT_FAIL":
    case "LOGOUT_SUCCESS":
      return {
        user: null,
      };
    case 'PROFILE_SUCCESS':
      axios.defaults.headers["Authorization"] = `Bearer ${action.user.idToken}`;
      return {
        ...state,
        user: action.user.signedInUser,
        token: action.user.idToken,
      };
    case 'STRAVA_PROFILE_SUCCESS':
      axios.defaults.headers["Authorization"] = `Bearer ${action.user.idToken}`;
      return {
        ...state,
        user: action.user.signedInUser,
        token: action.user.idToken,
        strava: {
          ...state.strava,
          connected: true,
          profile: action.athlete,
        }
      };
    case 'STRAVA_CONNECT_SUCCESS':
      axios.defaults.headers["Authorization"] = `Bearer ${action.user.idToken}`;
      return {
        ...state,
        strava: {
          ...state.strava,
          connected: true,
          profile: action.athlete,
        }
      };
    case 'STRAVA_ACTIVITY_SUCCESS':
      return {
        ...state,
        strava: {
          ...state.strava,
          activities: action.activities,
        }
      };
    case 'REFRESH_TOKEN':
      axios.defaults.headers["Authorization"] = `Bearer ${action.token}`;
      return state;
    default:
      return state;
  }
};