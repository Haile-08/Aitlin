import { client } from "../@types";
import axiosBaseURL from "../config/axios";

export const addClient = async ({ data, token }: client) => {
    const client = await axiosBaseURL
      .post(`/v1/admin/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (res) {
        return res;
      })
      .then(function (resData) {
        return resData.data;
      })
      .catch(function (err) {
        console.log(err);
      });
  
    return client;
};

export const retrieveClients = async (page: number) => {
  const client = await axiosBaseURL
    .get(`/v1/admin/client/?page=${page}`)
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