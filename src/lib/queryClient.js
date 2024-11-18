import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const queryClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

queryClient.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = handleError(error);
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

export default queryClient;
