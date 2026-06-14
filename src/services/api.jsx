// src/services/api.js
import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const token = cookies.get('token');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',

});
// Add a request interceptor to set the token dynamically before each request
api.interceptors.request.use(
  (config) => {
    const token = cookies.get('token'); // get fresh token from cookies each time
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;
