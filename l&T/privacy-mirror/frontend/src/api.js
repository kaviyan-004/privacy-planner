import axios from 'axios';

const api = axios.create({
  // Use Vercel's env variable for the production backend URL, otherwise fallback to localhost
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
