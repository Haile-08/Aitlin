import axios from 'axios';

const fetchData = async (id: string, token: string) =>{
  const data = {id};
  await axios.post(
    'http://localhost:4000/v1/auth', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(function (res) {
    return res;
  })
    .then(function (resData) {
      console.log('result data', resData.data);
      return resData.data;
    })
    .catch(function (err) {
      console.log(err);
    });
};

export default fetchData;