import axios from 'axios';
import { getAuthToken } from './tokenService';
const instance = axios.create({
  baseURL: 'http://192.168.1.3:5050/', // change this dynamically for dev/prod later
  timeout: 10000, // optional timeout
});
// Optional: Add a request interceptor to attach auth token globally

instance.interceptors.request.use(
  async (config) => {
    const token = getAuthToken();
    // If using Firebase Auth, you can get the token here
    // const token = await getIdTokenFromFirebase(); // or use context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Global error interceptor
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Trigger logout or show session expired
    }
    return Promise.reject(error);
  }
);

export default instance;
