import { push } from 'connected-react-router';
import { notification } from 'antd';
import infoPayload from './payloadHandlers/infoPayload';
import { ALERT_SHOW } from '../redux/actions/feedback';
import { ROOT_PATH } from '../routing/paths';
import { SESSION_DESTROY } from '../redux/actions/auth/logOut';

const showNotification = (response) => {
  if (response.data.info) {
    try {
      notification[response.data.info.type ? response.data.info.type : 'error']({
        message: response.data.info.message,
        duration: 10,
      });
    } catch (e) {
      notification.error({
        message: 'Ha ocurrido un error, ponte en contacto con nuestro equipo',
      });
    }
  }
};

const logOut = {
  type: SESSION_DESTROY,
  payload: {
    admin: null,
    logged: null,
  },
};

export default (
  dispatch,
  response,
  onSuccess,
  path = null,
  postActions = [],
  callbacks = [],
  onFailure = null,
) => {
  if (response === undefined) {
    dispatch({
      type: ALERT_SHOW,
      payload: infoPayload(
        'Error al comunicarse con el servidor, intenta de nuevo mas tarde',
        'error',
      ),
    });
  } else if (response.data.success) {
    onSuccess(dispatch, response.data);
    if (path !== null) dispatch(push(path));
    if (postActions.length !== 0) {
      postActions.forEach((action) => {
        dispatch(action(response.data));
      });
    }
    if (callbacks.length !== 0) {
      callbacks.forEach((action) => {
        action(response.data);
      });
    }
  } else if (!response.data.success) {
    if (onFailure) { onFailure(dispatch, response.data); }
    switch (response.data.code) {
      case 404:
        showNotification(response);
        dispatch(push(ROOT_PATH));
        dispatch(logOut);
        break;
      case 401:
        localStorage.removeItem('user');
        showNotification(response);
        dispatch(push('/'));
        dispatch(logOut);
        break;
      default:
        showNotification(response);
        break;
    }
  }
};
