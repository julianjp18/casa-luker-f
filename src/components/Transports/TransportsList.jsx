import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import collections from '../../utils/collections';
import { firestoreDB } from '../../utils/firebase';
import { getDuration, STATUS } from '../../utils/extras';

const columns = [
  {
    title: 'Placa',
    dataIndex: 'vehicle',
    key: 'vehicle',
  },
  {
    title: 'Canal',
    dataIndex: 'channel',
    key: 'channel',
  },
  {
    title: (
      <>
        <p>Tiempos</p>
        <span>Entrada | Muelle | Salida</span>
      </>
    ),
    key: 'times',
    dataIndex: 'times',
    render: (times) => {
      let resArriveOnDock = times.arrive && times.on_dock ? getDuration(times.arrive, times.on_dock) : '';
      let resOnDockExit = times.on_dock && times.exit ? getDuration(times.on_dock, times.exit) : '';
      let resFinalTime = times.arrive && times.exit ? getDuration(times.arrive, times.exit) : '';
      
      return (
        <>
          <div className="timer-exact-container">
            <Tag color='#f50' key={times.arrive}>
              {times.arrive}
            </Tag>
            <Tag color='#108ee9' key={times.on_dock}>
              {times.on_dock}
            </Tag>
            <Tag color='#87d068' key={times.exit}>
              {times.exit}
            </Tag>
          </div>
          <div className="timer-container">
          <Tag color='blue' key={times.arrive}>
              {`EM: ${resArriveOnDock}`}
            </Tag>
            <Tag color='green' key={times.on_dock}>
              {`MS: ${resOnDockExit}`}
            </Tag>
            <Tag color='magenta' key={times.exit}>
              {`T: ${resFinalTime}`}
            </Tag>
          </div>
        </>
      )
    },
  },
  {
    title: 'Estado',
    key: 'status',
    dataIndex: 'status',
    render: (status) => {
      if (status === STATUS.ARRIVE) {
        return (
          <Tag className="status-tag" color='#f50' key={status}>
            Entrada
          </Tag>
        );
      } else if (status === STATUS.ON_DOCK) {
        return (
          <Tag className="status-tag" color='#108ee9' key={status}>
            En Muelle
          </Tag>
        );
      } else if (status === STATUS.EXIT) {
        return (
          <Tag className="status-tag" color='#87d068' key={status}>
            Salida
          </Tag>
        );
      } else {
        return (
          <Tag color={'magenta'} key={status}>
            Pendiente
          </Tag>
        );
      }
    },
  }
];

const TransportsList = () => {
  const [vehicles, setvehicles] = useState([]);

  const getData = () => {
    const data = firestoreDB.collection(collections.VEHICLES);

    data.onSnapshot((vehicles) => {
      setvehicles([]);
      const newvehiclesList = [];

      vehicles.forEach((vehicle) => {

        if (vehicle.data().channel && vehicle.data().brand) {
          newvehiclesList.push({
            ...vehicle.data(),
            key: vehicle.id,
          });
        }

      });

      if (newvehiclesList.length > 0) setvehicles(newvehiclesList);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="table-container">
      <Table dataSource={vehicles} columns={columns} />
    </div>
  );
};

export default TransportsList;
