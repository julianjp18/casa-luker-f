import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { authRoutes, mainRoutes } from '../../routing/routes';

export default () => (
  <Switch>
    {mainRoutes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        strict={route.strict}
        exact={route.exact}
        component={route.component}
      />
    ))}
    {authRoutes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        strict={route.strict}
        exact={route.exact}
        component={route.component}
      />
    ))}
    {/* <Route component={NotFound}/> */}
    <Redirect to="/" />
  </Switch>
);
