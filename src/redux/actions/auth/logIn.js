import loadingCall from '../../../helpers/loadingCall';
import server from '../../../apis/server';
import { ROOT_PATH } from '../../../routing/paths';

export const SESSION_CREATE = 'SESSION_CREATE';

const loginSuccess = (type) => (dispatch, data) => {
  localStorage.setItem('user', data.data);
  setTimeout(() => {
    dispatch({ type, payload: data.data });
  }, 1000);
};

export default (formValues) => async (dispatch) => loadingCall(
  dispatch,
  server.post('/log-in', {
    credential: {
      email: formValues.user.email,
      password: formValues.user.password,
    },
  }),
  loginSuccess(SESSION_CREATE),
  ROOT_PATH,
  [],
);
