import axios from 'axios';

axios.interceptors.request.use((config) => {
  config.baseURL = process.env.REACT_APP_SERVER_URL;
  config.headers['csrf-token'] = window.localStorage.getItem('csrfToken');
  config.withCredentials = true;

  return config;
}, (err) => {
  console.error(err);
  return Promise.reject(err);
});