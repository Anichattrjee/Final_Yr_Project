import axios from 'axios';

export const axiosInstance = () => {
    console.log(localStorage.getItem('token'))
  return axios.create({
    baseURL: 'http://localhost:3000', 
    headers: {
        
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
