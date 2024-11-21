import axios from 'axios';

// Create an Axios instance with the backend base URL
const api = axios.create({
    baseURL: 'http://localhost:5000', // Adjust based on your backend's URL
});

export default api;
