import notifySuccess from './notifySuccess';

export default (type) => (dispatch, result) => {
  notifySuccess(result);
  dispatch({ type, payload: result.data });
};
