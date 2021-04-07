import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { Bar, HorizontalBar, Pie } from '@reactchartjs/react-chart.js'

import './statistics.scss';
import collections from '../../../utils/collections';
import { firestoreDB } from '../../../utils/firebase';
import { getDuration } from '../../../utils/extras';

const secondsToMinutes = (seconds) => {
  const divisor_for_minutes = seconds % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);
  return minutes;
};

const TransportsStatistics = ({}) => {
  const [vehiclesList, setvehiclesList] = useState([]);
  const [slavesChannel, setslavesChannel] = useState(0);
  const [industryChannel, setindustryChannel] = useState(0);
  const [exportatitonChannel, setexportatitonChannel] = useState(0);
  const [arriveTimes, setarriveTimes] = useState(0);
  const [onDockTimes, setonDockTimes] = useState(0);
  const [exitTimes, setexitTimes] = useState(0);

  const getVehicleData = () => {
    const data = firestoreDB.collection(collections.VEHICLES);

    ['industrial', 'exportacion', 'cadenas'].forEach((channel) => {
      data.where("channel", "==", channel)
        .get()
        .then((querySnapshot) => {
          let count = 0;
          querySnapshot.forEach((doc) => {
              count++;
          });

          if (channel === 'industrial')
            setindustryChannel(count);
          if (channel === 'exportacion')
            setexportatitonChannel(count);
          if (channel === 'cadenas')
            setslavesChannel(count);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    });
    
    data.onSnapshot((vehicles) => {
      const newVehiclesListLabels = [];
      const newVehiclesListData = [];
      let sumKg = 0;
      let sumBoxes = 0;
      let sumArriveMinutesTimes = 0;
      let sumArriveSecondsTimes = 0;
      let sumOnDockMinutesTimes = 0;
      let sumOnDockSecondsTimes = 0;

      vehicles.forEach((vehicle) => {
        sumKg = vehicle.data().kg_to_load + sumKg;
        sumBoxes = vehicle.data().boxes_to_load + sumBoxes;
        const times = vehicle.data().times;
        
        if (times.arrive && times.on_dock && !times.exit) {
          const arriveDuration = getDuration(times.arrive, times.on_dock);
          const arriveDurationSplit = arriveDuration.split(':');
          sumArriveMinutesTimes = parseInt(arriveDurationSplit[1]) + sumArriveMinutesTimes;
          if ((parseInt(arriveDurationSplit[2]) + sumArriveSecondsTimes) >= 60) {
            sumArriveMinutesTimes = 1 + sumArriveMinutesTimes;
            sumArriveSecondsTimes = Math.abs(parseInt(arriveDurationSplit[2]) - sumArriveSecondsTimes);
          } else {
            sumArriveSecondsTimes = parseInt(arriveDurationSplit[2]) + sumArriveSecondsTimes;
          }
        }

        if (times.on_dock && times.exit) {
          const arriveDuration = getDuration(times.on_dock, times.exit);
          const arriveDurationSplit = arriveDuration.split(':');
          sumOnDockMinutesTimes = parseInt(arriveDurationSplit[1]) + sumOnDockMinutesTimes;
          if ((parseInt(arriveDurationSplit[2]) + sumOnDockSecondsTimes) >= 60) {
            sumOnDockMinutesTimes = 1 + sumOnDockMinutesTimes;
            sumOnDockSecondsTimes = Math.abs(parseInt(arriveDurationSplit[2]) - sumOnDockSecondsTimes);
          } else {
            sumOnDockSecondsTimes = parseInt(arriveDurationSplit[2]) + sumOnDockSecondsTimes;
          }
        }

        let statusName = 'PENDIENTE';
        let statusNumber = 0;
        switch (vehicle.data().status) {
          case 'NOT_ARRIVE':
            statusNumber = 1;
            statusName = 'PENDIENTE';
            break;
          case 'ARRIVE':
            statusName = 'ENTRADA';
            statusNumber = 2;
            break;
          case 'ON_DOCK':
            statusName = 'EN MUELLE';
            statusNumber = 4;
            break;
          case 'EXIT':
            statusName = 'SALIDA';
            statusNumber = 6;
            break;
          default:
            break;
        };

        newVehiclesListData.push(statusNumber);
        newVehiclesListLabels.push(`${vehicle.data().name_client}`);
      });


      sumArriveMinutesTimes = secondsToMinutes(sumArriveSecondsTimes) + sumArriveMinutesTimes;

      sumOnDockMinutesTimes = secondsToMinutes(sumOnDockSecondsTimes) + sumOnDockMinutesTimes;

      if (newVehiclesListData.length > 0) setvehiclesList({
        labels: newVehiclesListLabels,
        data: newVehiclesListData,
        sumKg,
        sumBoxes,
        arriveMinutes: sumArriveMinutesTimes,
        arriveSeconds: sumArriveSecondsTimes,
        onDockMinutes: sumOnDockMinutesTimes,
        onDockSeconds: sumOnDockSecondsTimes,
      });
    });

  };

  useEffect(() => {
    getVehicleData();
  }, []);
  
  const channelsData = {
    labels: ['Cadenas', 'Exportación', 'Industrial'],
    datasets: [
      {
        label: 'Canales',
        data: [slavesChannel, exportatitonChannel, industryChannel],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const vehiclesData = {
    labels: vehiclesList.labels,
    datasets: [
      {
        label: 'Ubicación vehículo: 1 (pendiente), 2 (entrada), 4 (en muelle), 6 (salida)',
        data: vehiclesList.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const timesData = {
    labels: [
      `Entrada (${vehiclesList.arriveMinutes}:${vehiclesList.arriveSeconds}):`,
      `En muelle (${vehiclesList.onDockMinutes}:${vehiclesList.onDockSeconds})`,
    ],
    datasets: [
      {
        label: 'Tiempos en almacén (minutos)',
        data: [vehiclesList.arriveMinutes, vehiclesList.onDockMinutes],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const productivityData = {
    labels: ['KG movilizados', 'CJ cargadas'],
    datasets: [
      {
        label: 'Productividad',
        data: [vehiclesList.sumKg, vehiclesList.sumBoxes],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }
  
  const optionsHorizontalBar = {
    scales: {
      x: {
          max: 7,
          min: 0,
      },
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    }
  };

  return (
    <div className="products-statistics-container">
      <h2>Estadísticas de transportes</h2>
      <Row className="products-statistics-content">
        <Col xs={12}>
          <h2>Canales</h2>
          <Bar data={channelsData} options={options} />
        </Col>
        <Col xs={12}>
          <h2>Ubicación vehículos</h2>
          <HorizontalBar data={vehiclesData} options={optionsHorizontalBar} />
        </Col>
        <Col xs={12}>
          <h2>Productividad</h2>
          <HorizontalBar data={productivityData} options={optionsHorizontalBar} />
        </Col>
        <Col xs={12}>
          <h2>Tiempos en almacén (minutos)</h2>
          <Pie data={timesData} options={options} />
        </Col>
      </Row>
    </div>
  );
};

export default TransportsStatistics;
