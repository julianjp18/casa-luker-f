import axios from 'axios';
import qs from 'qs';
import url from './url';

const server = axios.create({
  baseURL: url,
  withCredentials: true,
  headers: {
    common: {
      ContentType: 'application/json',
    },
    ContentType: 'application/json',
  },
});

server.defaults.paramsSerializer = (params) => qs.stringify(params, { encode: false });

server.interceptors.response.use((response) => (response), (error) => (error.response));
/*
server.interceptors.request.use((request) => {
  const newRequest = request;
  const token = localStorage.getItem('token');
  if (token) {
    newRequest.headers.Authorization = `Bearer ${token}`;
  }
  return newRequest;
}, (error) => (error.response));
*/
export default server;
