import axiosBaseURL from "../config/axios";

export const retrieveClientServices = async ({page, clientId, search, token}: {page: number, clientId: string, search: string, token: string}) => {
    const client = await axiosBaseURL
      .get(`/v1/client/service/?search=${search}&page=${page}&clientId=${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (res) {
        return res;
      })
      .then(function (resData) {
        console.log(resData.data.blog);
        return resData.data;
      })
      .catch(function (err) {
        console.log(err);
      });
    return client;
  };