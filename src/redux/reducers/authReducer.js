import { SESSION_CREATE } from '../actions/auth/logIn';
import { SESSION_DESTROY } from '../actions/auth/logOut';

export const INITIAL_STATE = {
  admin: false,
  email: null,
  logged: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SESSION_CREATE:
      return { ...state, ...action.payload };
    case SESSION_DESTROY:
      localStorage.removeItem('token');
      localStorage.removeItem('logged');
      return INITIAL_STATE;
    default:
      return state;
  }
};
