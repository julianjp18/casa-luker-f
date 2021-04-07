import { push } from 'connected-react-router';
import { ROOT_PATH } from '../../../routing/paths';

export const SESSION_DESTROY = 'SESSION_DESTROY';

export default () => (dispatch) => {
  localStorage.removeItem('user');
  dispatch(push(ROOT_PATH));
  dispatch({
    type: SESSION_DESTROY,
    payload: {
      admin: false,
      logged: false,
    },
  });
};
