import axios from 'axios';

axios.interceptors.request.use((config) => {
  config.baseURL = 'http://localhost:5000';
  config.headers['csrf-token'] = window.localStorage.getItem('csrfToken');
  config.withCredentials = true;

  return config;
}, (err) => {
  console.error(err);
  return Promise.reject(err);
});