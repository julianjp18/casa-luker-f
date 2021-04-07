import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../../redux/reducers';
import history from '../../routing/history';

export default function configureStore() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(
    reducers(history),
    composeEnhancers(applyMiddleware(thunk, routerMiddleware(history))),
  );
}
