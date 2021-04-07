import React from 'react';
import { Row, Col, Form, InputNumber, Select, Input, Button } from 'antd';

import './newProduct.scss';
import collections from '../../../utils/collections';
import { firestoreDB } from '../../../utils/firebase';
import { CITIES, IN_PRODUCTION, openNotification, STATUS } from '../../../utils/extras';

const { Option } = Select;

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const tailLayout = {
  wrapperCol: {
    span: 24,
  },
};

const createUvaInFirestore = async (data) => {
  if (data.name && data.uva && data.sku && data.units.units && data.units.stock && data.city) {
    try {
      const docRef = firestoreDB.collection(collections.PRODUCTS).doc();

      await docRef.set({
        uva: data.uva,
        name: data.name,
        stock: data.units.stock,
        units: data.units.units,
        city: data.city,
        sku: data.sku,
        location: {
          rac: '',
          floor: '',
          position: '',
        },
        status: STATUS.IN_PRODUCTION,
        created_at: new Date(),
      });
    } catch (err) {
      console.log(err);
    }

    return true;
  } else
    return false;

};

const NewProduct = () => {

  const onFinish = (values) => {
    const res = createUvaInFirestore(values);
    res.then((result) => {
      
      if (result)
        openNotification('success', 'Se agregó el producto satisfactoriamente');
      else 
        openNotification('error', 'NO se agregó el producto. Inténtalo nuevamente.');
    });
      
  };

  const onFinishFailed = (e) => {

  };

  return (
    <Row className="new-product-container">
      <Col xs={24}>
        <h2>Nuevo producto</h2>
        <div className="new-product-form-content">
          <Form
            {...layout}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="UVA"
              name="uva"
              rules={[
                {
                  required: true,
                  message: 'Por favor inserta código UVA',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nombre"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Por favor inserta un nombre',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="SKU"
              name="sku"
              rules={[
                {
                  required: true,
                  message: 'Por favor inserta código SKU',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Unidades">
              <Input.Group compact>
                <Form.Item
                  name={['units', 'stock']}
                  noStyle
                  rules={[{ required: true, message: 'Cantidad es requerida' }]}
                >
                  <InputNumber min={1} max={1000} style={{ width: '30%' }} placeholder="Cantidad" />
                </Form.Item>
                <Form.Item
                  name={['units', 'units']}
                  noStyle
                  rules={[{ required: true, message: 'Unidad es requerida' }]}
                >
                  <Select placeholder="Selecciona una unidad" style={{ width: '70%' }}>
                      <Option value="kg">Kilogramos</Option>
                      <Option value="t">Toneladas</Option>
                      <Option value="gr">Gramos</Option>
                      <Option value="lb">Libras</Option>
                      <Option value="lt">Litros</Option>
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item
              label="Ciudad destino"
              name="city"
              rules={[
                {
                  required: true,
                  message: 'Por favor inserta ciudad destino',
                },
              ]}
            >
              <Select placeholder="Selecciona una ciudad">
                  {CITIES.map((city) => (
                    <Option key={city} value={city}>{city}</Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Agregar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default NewProduct;
