import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sua-api.com/api',
});

export default api;
