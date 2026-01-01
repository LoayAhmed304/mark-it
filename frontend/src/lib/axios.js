import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL:
    'https://mark.loay.work/api' ,
  withCredentials: true,
});
