import Axios from 'axios';

const axiosBaseURL = Axios.create({
  baseURL: 'https://clientes.atend.mx/api',
});

export default axiosBaseURL;