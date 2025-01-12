import axios from 'axios';

// Create a new axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // or your actual backend URL
  headers: {
    "Content-Type": "application/json",
},
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // If token exists, attach it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // If something goes wrong, just reject
    return Promise.reject(error);
  }
);

export default axiosInstance;
