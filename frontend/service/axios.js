import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://design-your-career-path-2.onrender.com/api',
    withCredentials: true,
});

export default instance;
