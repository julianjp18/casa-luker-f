import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { openNotification } from '../../utils/extras';

import './camqr.scss';

const server = 'https://server1.proyectohorus.com.ar';
const user = 'TrekingSAS2';
const password = 'Treking2021#';
const profileuuid = '1a28921e97e211eb944500155d714f00';

const backendUrl = 'https://afternoon-bastion-43792.herokuapp.com/';

const CamQR = ({ isProductView = false, isVehicleView = false }) => {
  const [position, setposition] = useState([]);
  const [vehicle, setvehicle] = useState([]);

  let token = "";
  let instance = "";

  // CONVIERTE LA IMAGEN DE BASE64 A BYTE
  const base64toBlob = (base64Data, contentType) => {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  // OBTIENE EL TOKEN
  const getToken = () => {
    const form = new FormData();
    form.append('user', user);
    form.append('password', password);
    form.append('profileuuid', profileuuid);

    const GetToken = new XMLHttpRequest();

    GetToken.open('POST', server + '/api/v2/functions/login?responseformat=json', true);

    GetToken.onload = function () {
      if (GetToken.status == 200) {
        if (this.response) {
          var data = JSON.parse(this.response);

          token = data.token;
          instance = data.instance;
        }
      }
    };

    GetToken.send(form);
  };

  const sendToInventory = (data) => {
    let response = '';
    const request = new XMLHttpRequest();

    request.open('POST', backendUrl + 'product-qr-code', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader("Access-Control-Allow-Origin", "*");
    request.setRequestHeader("Access-Control-Allow-Methods", "POST");

    request.onload = function () {
      if (this.response) {
        try {
          console.log(typeof this.response, this.response);
          response = JSON.parse(this.response);

          if (request.status == 200) {
            if (response.value && response.value.includes('/'))
              setposition(response.value.split('/'));
            else
              setposition([]);

            openNotification(response.response, response.message);
          } else if (request.status == 404) {
            if (response.value !== '')
              openNotification('warning', response.message);
          }
        } catch (err) {
          console.log(err);
        }
      }

    };

    request.send(data);
  };

  const saveVehicleState = (data) => {
    let response = '';
    const request = new XMLHttpRequest();

    request.open('POST', backendUrl + 'vehicle-qr-code', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader("Access-Control-Allow-Origin", "*");
    request.setRequestHeader("Access-Control-Allow-Methods", "POST");

    request.onload = function () {
      if (this.response) {
        try {
          console.log(typeof this.response, this.response);
          response = JSON.parse(this.response);

          if (request.status == 200) {
            if (response.value && response.value.includes('/'))
              setvehicle(response.value.split('/'));
            else
              setvehicle([response.value, '']);

            openNotification(response.response, response.message);
          } else if (request.status == 404) {
            if (response.value !== '')
              openNotification('warning', response.message);
          }
        } catch (err) {
          console.log(err);
        }
      }

    };

    request.send(data);
  };

  // LLAMADA A ENDPOINT DE CODEBAR DECODER PARA OBTENER LOS DATOS DE UN QR O CODIGO DE BARRAS
  const Recognition = () => {
    window.Webcam.snap(function (data_uri) {
      const request = new XMLHttpRequest();

      request.open('POST', server + '/api/v2/functions/codebar/decoder?responseformat=json', true);
      request.setRequestHeader('Authorization', 'Bearer ' + token);
      request.setRequestHeader('Content-Type', 'image/jpeg; application/json; charset=utf-8');

      request.onload = function () {
        if (request.status == 200) {
          if (this.response) {
            const data = JSON.parse(this.response);

            let result = '';
            if ((data && data.detected_id !== 'FAIL' && data.detected_id !== undefined)) {
              result = data.detected_id.replace('VH', '').replace('(QRCODE)', '');
            } else
              result = 'No detectado';

            if (isProductView) {
              sendToInventory(this.response);
              const resultElement = document.getElementById('results');
              if (resultElement) {
                resultElement.innerHTML = `${result}`;
              }
            } else if (isVehicleView) {
              saveVehicleState(this.response);
            }
          }
        }
      };

      var parts = data_uri.split(";base64,");
      var contentType = parts[0].replace("data:", "");
      var base64 = parts[1];

      request.send(base64toBlob(base64, "image/jpeg"));
    }
    );
  }

  // ACTIVA EL RECONOCIMIENTO
  const start = () => {
    getToken();
    setInterval(Recognition, 2000);
  }

  useEffect(() => {
    setTimeout(start, 5000);
  }, []);

  return (
    <div className="camqr-container">
      <Row className="camqr-content">
        <Col xs={8}>
          <div className="info-qr">
            <p className="subtitle">TrekingAI - CamQR</p>
            <Row>
              <Col xs={20}>
                <div className="description-content">
                  <p className="description">
                    Para hacer uso de la lectura inteligente:
                  </p>
                  <Row>
                    <Col xs={2}>
                      <span className="description-list-number">1. </span>
                    </Col>
                    <Col xs={22}>
                      <span className="description-item">Activa la cámara</span>
                    </Col>
                    <Col xs={2}>
                      <span className="description-list-number">2. </span>
                    </Col>
                    <Col xs={22}>
                      <span className="description-item">Escanea el código QR en orden.</span>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={4}></Col>
            </Row>
          </div>
        </Col>
        <Col xs={8}>
          <div className="my-camera" id="my_camera"></div>
        </Col>
        <Col xs={8}>
          <div className="response-content">
            <p className="title">Lectura AI</p>
            <div className="response-view-content">
              {isProductView ? (
                <div className="product-response">
                  <p className="position">
                    {position.length > 0
                      ? `RAC: ${position[0]} | Piso: ${position[1]} | Posición: ${position[2]}`
                      : `RAC: | Piso: | Posición:`}
                  </p>
                  <p id="results" className="uva"></p>
                </div>
              ) : (
                <Row className="vehicle-response">
                  <Col xs={12}>
                    <p className="title">Posición:</p>
                    <p className="position-result">
                      {vehicle.length > 0 ? vehicle[0] : ''}
                    </p>
                  </Col>
                  <Col xs={12}>
                    <p className="title">Placa:</p>
                    <p className="vehicle-result">
                      {vehicle.length > 0 ? vehicle[1] : ''}
                    </p>
                  </Col>
                </Row>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CamQR;
