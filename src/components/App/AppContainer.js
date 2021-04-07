import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import moment from 'moment';
import 'moment/locale/es';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './App.scss';
import sessionsDestroy from '../../redux/actions/auth/logOut';
import RoutesContainer from './RoutesContainer';
import CommonHeader from '../Header';
import Sider from '../Sider';

const AppContainer = ({ auth, push, sessionsDestroy }) => {
  const [isAuth, setisAuth] = useState(false);
  moment.locale('es');

  useEffect(() => {
    if (localStorage.getItem('user')) setisAuth(true);
  }, [localStorage.getItem('user')]);

  const render = () => (
    <Layout>
      {isAuth && (
        <Layout.Header className="nav">
          <CommonHeader logOut={sessionsDestroy} auth={auth} push={push} />
        </Layout.Header>
      )}
      <Layout>
        {isAuth && (
          <Layout.Sider>
            <Sider logOut={sessionsDestroy} auth={auth} push={push} />
          </Layout.Sider>
        )}
        <Layout.Content>
          <div className="layout-content">
            <RoutesContainer />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );

  return render();
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default withRouter(
  connect(mapStateToProps,
    {
      push,
      sessionsDestroy,
    })((AppContainer)),
);
