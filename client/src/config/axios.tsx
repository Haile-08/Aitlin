import Axios from 'axios';

const axiosBaseURL = Axios.create({
  baseURL: 'http://localhost',
});

export default axiosBaseURL;