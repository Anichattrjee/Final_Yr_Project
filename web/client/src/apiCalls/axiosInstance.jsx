// src/apiCalls/axiosInstance.js
import axios from 'axios';

// 1️⃣ Create the instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

// 2️⃣ Attach your interceptor to *that* instance
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 3️⃣ Export the configured instance
export { axiosInstance};
