import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL + '/api' || 'http://localhost:5000/api',
  withCredentials: true,
});
