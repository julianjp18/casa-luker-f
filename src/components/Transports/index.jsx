import React from 'react';
import { Row, Col } from 'antd';

import './transports.scss';
import TransportsList from './TransportsList';
import CamQR from '../CamQR';

const Transports = () => {

  return (
    <Row className="products-container">
      <Col xs={24}>
        <h2>Lectura inteligente</h2>
        <CamQR isVehicleView />
        <h2>Lista de vehículos</h2>
        <TransportsList />
      </Col>
    </Row>
  );
};

export default Transports;
