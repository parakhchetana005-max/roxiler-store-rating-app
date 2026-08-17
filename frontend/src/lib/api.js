import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    return Promise.reject(err.response?.data?.errors || { server: 'An unexpected error occurred' });
  }
);
