import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Router } from 'react-router-dom';
import history from '../../routing/history';
import AppContainer from './AppContainer';

export default () => (
  <ConnectedRouter history={history}>
    <Router history={history}>
      <AppContainer />
    </Router>
  </ConnectedRouter>
);
