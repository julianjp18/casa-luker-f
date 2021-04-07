import React from 'react';
import { Row, Col } from 'antd';

import './products.scss';
import ProductsList from './ProductsList';
import CamQR from '../CamQR';

const Products = () => {

  return (
    <Row className="products-container">
      <Col xs={24}>
        <h2>Lectura inteligente</h2>
        <CamQR isProductView />
        <h2>Lista de productos</h2>
        <ProductsList />
      </Col>
    </Row>
  );
};

export default Products;
