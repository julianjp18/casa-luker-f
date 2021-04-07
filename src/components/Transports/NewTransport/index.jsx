import React from 'react';
import { Row, Col, Form, InputNumber, Select, Input, Button } from 'antd';

import './newTransport.scss';
import collections from '../../../utils/collections';
import { firestoreDB } from '../../../utils/firebase';
import { IN_PRODUCTION, openNotification, STATUS } from '../../../utils/extras';

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

const createVehicleInFirestore = async (data) => {
  const {
    vehicle,
    model,
    brand,
    channel,
    boxes_to_load,
    kg_to_load,
    name_client,
  } = data;

  if (vehicle && model && brand && channel && boxes_to_load && kg_to_load) {
    try {
      const docRef = firestoreDB.collection(collections.VEHICLES).doc();

      await docRef.set({
        name_client,
        vehicle,
        model,
        brand,
        channel,
        boxes_to_load,
        kg_to_load,
        status: STATUS.NOT_ARRIVE,
        times: {
          arrive: '',
          on_dock: '',
          exit: '',
        },
        created_at: new Date(),
      });

    } catch (err) {
      console.log(err);
    }

    return true;
  } else
    return false;

};

const NewTransport = () => {

  const onFinish = (values) => {
    const res = createVehicleInFirestore(values);
    res.then((result) => {
      
      if (result)
        openNotification('success', 'Se registró el vehículo satisfactoriamente');
      else 
        openNotification('error', 'NO se registró el vehículo. Inténtalo nuevamente.');
    });
    
  };

  const onFinishFailed = (e) => {

  };

  return (
    <Row className="new-vehicle-container">
      <Col xs={24}>
        <h2>Nuevo vehículo</h2>
        <div className="new-vehicle-form-content">
          <Form
            {...layout}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="vehicle"
              label="Placa"
              placeholder="Ej: ABC123"
              rules={[
                {
                  required: true,
                  message: 'Por favor inserta la placa del vehiculo!',
                  whitespace: true,
                },
                () => ({
                  validator(rule, value) {
                    const reg = /[a-z]{3}[0-9]{3}$/;
                    if (reg.exec(value.toLowerCase())) return Promise.resolve();
                    return Promise.reject('Estructura de placa: XXX123');
                  },
                }),
              ]}
              normalize={(value) => (value || '').toUpperCase()}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Marca"
              name="brand"
              rules={[
                {
                  required: true,
                  message: 'Por favor inserta marca',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nombre cliente"
              name="name_client"
              rules={[
                {
                  required: true,
                  message: 'Por favor inserta nombre de cliente',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Modelo"
              name="model"
              rules={[
                {
                  required: true,
                  message: 'Por favor inserta modelo del vehículo',
                },
              ]}
            >
              <InputNumber min={1990} max={2021} style={{ width: '100%' }} placeholder="EJ: 2021" />
            </Form.Item>
            <Form.Item
              label="Canal"
              name="channel"
              rules={[{ required: true, message: 'Canal es requerida' }]}
            >
              <Select placeholder="Selecciona un canal" style={{ width: '100%' }}>
                <Option value="cadenas">Cadenas</Option>
                <Option value="exportacion">Exportación</Option>
                <Option value="industrial">Industrial</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Cajas a cargar"
              name="boxes_to_load"
              rules={[
                {
                  required: true,
                  message: 'Por favor inserta cajas a cargar',
                },
              ]}
            >
              <InputNumber min={1} max={2000} style={{ width: '100%' }} placeholder="EJ: 15" />
            </Form.Item>
            <Form.Item
              label="KG a cargar"
              name="kg_to_load"
              rules={[
                {
                  required: true,
                  message: 'Por favor inserta KG a cargar',
                },
              ]}
            >
              <InputNumber min={1} max={2000} style={{ width: '100%' }} placeholder="EJ: 10" />
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

export default NewTransport;
