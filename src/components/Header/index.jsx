import React from 'react';
import { Dropdown, Menu } from 'antd';
import './header.scss';
import { DownOutlined } from '@ant-design/icons';
import logo from '../../resources/images/logo-luker.png';

const CommonHeader = ({ auth, push, logOut }) => {
  const sessionDestroy = () => {
    localStorage.clear();
    window.location = '/';
  };

  const goTo = (path) => {
    push(path);
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a rel="noopener noreferrer" onClick={sessionDestroy}>
          Cerrar sesión
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <img className="logo" src={logo} alt="logo casa-luker"/>
      <Dropdown overlay={menu}>
        <div className="profile-content">
          <img className="profile-img" src="https://picsum.photos/50/50" alt="profile" />
          <div className="username-container">
            <p>Milton Castaño</p>
            <span>Jefe de Cedi</span>
          </div>
          <DownOutlined />
        </div>
      </Dropdown>
      
    </>
  );
};

export default CommonHeader;
