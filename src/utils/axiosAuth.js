import axios from 'axios';
// config
 

// ----------------------------------------------------------------------

const axiosAuthInstance = axios.create({
  // baseURL: process.env.REACT_APP_API_ENDPOINT,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

axiosAuthInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosAuthInstance;
