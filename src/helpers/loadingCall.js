import handleResponse from './handleResponse';

export const LOAD_START = 'LOAD_START';
export const LOAD_END = 'LOAD_END';

export default async (
  dispatch,
  apiCall,
  onSuccess,
  path = null,
  postActions = [],
  callbacks = [],
  onFailure) => {
  dispatch({ type: LOAD_START });
  const response = await apiCall;
  handleResponse(dispatch, response, onSuccess, path, postActions, callbacks, onFailure);
  dispatch({ type: LOAD_END });
  return response;
};
