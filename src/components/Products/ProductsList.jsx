import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import collections from '../../utils/collections';
import { firestoreDB } from '../../utils/firebase';

const columns = [
  {
    title: 'UVA',
    dataIndex: 'uva',
    key: 'uva',
  },
  {
    title: 'Nombre',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    key: 'sku',
  },
  {
    title: 'Unidades',
    dataIndex: 'stock',
    key: 'stock',
    render: (stock, record) => {
      return (
        <p>{`${stock} ${record.units ? record.units : ''}`}</p>
      )
    },
  },
  {
    title: 'Ciudad destino',
    dataIndex: 'city',
    key: 'city',
  },
  {
    title: (
      <>
        <p>Ubicación</p>
        <span>RAC | Piso | Posición</span>
      </>
    ),
    key: 'location',
    dataIndex: 'location',
    render: (location) => (
      <>
        <Tag color='#f50' key={location.rac}>
          {location.rac.toUpperCase()}
        </Tag>
        <Tag color='#108ee9' key={location.floor}>
          {location.floor.toUpperCase()}
        </Tag>
        <Tag color='#87d068' key={location.position}>
          {location.position.toUpperCase()}
        </Tag>
      </>
    ),
  },
  {
    title: 'Estado',
    key: 'status',
    dataIndex: 'status',
    render: (status) => (
      <Tag color={status === 'IN_STOCK' ? 'orange' : 'geekblue'} key={status}>
        {(status === 'IN_STOCK' ? 'inventario' : 'producción').toUpperCase()}
      </Tag>
    ),
  }
];

const ProductsList = () => {
  const [products, setproducts] = useState([]);

  const getData = () => {
    const data = firestoreDB.collection(collections.PRODUCTS);

    data.onSnapshot((products) => {
      setproducts([]);
      const newProductsList = [];

      products.forEach((product) => {

        if (product.data().name && product.data().uva) {
          newProductsList.push({
            ...product.data(),
            key: product.id,
          });
        }

      });

      if (newProductsList.length > 0) setproducts(newProductsList);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="table-container">
      <Table dataSource={products} columns={columns} />
    </div>
  );
};

export default ProductsList;
