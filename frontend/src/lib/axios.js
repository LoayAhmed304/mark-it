import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.BACKEND_URL || 'http://localhost:5000',
  withCredentials: true,
});
