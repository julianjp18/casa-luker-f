import React from 'react';
import { Menu } from 'antd';
import { BookOutlined, CarOutlined } from '@ant-design/icons';
import './sider.scss';

const { SubMenu } = Menu;

const Sider = ({ push }) => {

  const handleClick = (e) => {
    push(`/${e.key}`);
  };

  return (
    <Menu
      onClick={handleClick}
      style={{ width: 256 }}
      defaultOpenKeys={['sub1', 'sub2']}
      mode="inline"
    >
      <SubMenu key="sub1" icon={<BookOutlined />} title="Productos">
        <Menu.Item key="products">Lista de productos</Menu.Item>
        <Menu.Item key="products/new">Agregar un producto</Menu.Item>
        <Menu.Item key="products/statistics">Estadísticas</Menu.Item>
      </SubMenu>
      <SubMenu key="sub2" icon={<CarOutlined />} title="Transporte">
        <Menu.Item key="transports">Lista de vehículos</Menu.Item>
        <Menu.Item key="transports/new">Agregar un vehículo</Menu.Item>
        <Menu.Item key="transports/statistics">Estadísticas</Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default Sider;
