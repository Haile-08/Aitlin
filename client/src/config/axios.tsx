import Axios from 'axios';

const axiosBaseURL = Axios.create({
  baseURL: 'https://aitlin.onrender.com',
});

export default axiosBaseURL;