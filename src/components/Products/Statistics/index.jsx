import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { Line } from '@reactchartjs/react-chart.js'

import './statistics.scss';
import collections from '../../../utils/collections';
import { firestoreDB } from '../../../utils/firebase';
import { COLORS, MONTHS_LABELS } from '../../../utils/extras';

// Retorna un número aleatorio entre min (incluido) y max (excluido)
const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


const ProductsStatistics = ({}) => {
  const [citiesResults, setcitiesResults] = useState([]);
  const [aprilData, setaprilData] = useState([]);

  const getData = () => {
    const data = firestoreDB.collection(collections.PRODUCTS);

    data.onSnapshot((products) => {
      setaprilData([]);
      const newProductsList = [];

      products.forEach((product) => {

        if (product.data().name && product.data().uva) {
          newProductsList.push({
            ...product.data(),
            key: product.id,
          });
        }

      });

      if (newProductsList.length > 0) setaprilData(newProductsList);
    });

    if (citiesResults.length > 0) setcitiesResults([]);
    firestoreDB.collection(collections.PRODUCTS).get()
      .then((querySnapshot) => {
        let objCities = {};
        querySnapshot.forEach((doc) => {
          if (objCities[doc.data().city] && objCities[doc.data().city] !== undefined) {
            
            objCities = {
              ...objCities,
              [doc.data().city]: objCities[doc.data().city] + 1,
            };
          }
          else {
            
            if (doc.data().city !== undefined) {
              objCities = {
                ...objCities,
                [doc.data().city]: 1,
              };
            }
          }
            
        });
        const newCitiesResults = [];
        // Or, using array extras
        console.log('objCities', objCities);
        Object.entries(objCities).forEach(([key, value]) => {
          newCitiesResults.push({
            data: [
              getRandomArbitrary(1000, 2000),
              getRandomArbitrary(2000, 3000),
              getRandomArbitrary(1000, 4000),
              value,
            ],
            borderColor: COLORS[getRandomArbitrary(0, COLORS.length - 1)],
            backgroundColor: 'transparent',
            label: key,
          });
        });

        setcitiesResults(newCitiesResults);
        console.log(citiesResults);
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });
    /*
    cities.forEach((city) => {
      firestoreDB.collection(collections.PRODUCTS).where("city", "==", city)
        .get()
        .then((querySnapshot) => {
          let count = 0;
          querySnapshot.forEach((doc) => {
              count++;
          });
          objCities = {
            ...objCities,
            [city]: count,
          };

        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
      });
    */
    
  };

  useEffect(() => {
    getData();
  }, []);

  const stockCityAndProductData = {
    datasets: citiesResults,
    labels: MONTHS_LABELS,
  };

  const options = {
    pointRadius: 1,
  };

  const droneInventoryData = {
    datasets: [{
      data: [100, 120, 180, aprilData.length],
      label: 'Inventario total',
      backgroundColor: 'rgba(128,164,237, 0.8)',
      borderColor: 'rgba(128,164,237, 1)',
      pointRadius: 9,
      pointBackgroundColor: 'rgba(150,164,237, 1)'
    }],
    labels: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
    ],
  };

  return (
    <div className="products-statistics-container">
      <h2>Estadísticas de productos</h2>
      <Row className="products-statistics-content">
        <Col xs={12}>
          <Line data={stockCityAndProductData} options={options} />
        </Col>
        <Col xs={12}>
          <Line data={droneInventoryData} options={options} />
        </Col>
      </Row>
    </div>
  );
};

export default ProductsStatistics;
