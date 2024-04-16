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

export const retrieveClients = async ({page, search, token}: {page: number, search: string, token: string}) => {
  const client = await axiosBaseURL
    .get(`/v1/admin/service/?search=${search}&page=${page}`, {
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

export const updateStatus = async ({ data, token }: any) => {
  const client = await axiosBaseURL
    .put(`/v1/admin/service/status`, data, {
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


export const addServiceData = async ({ data, token, page }: any) => {
  const client = await axiosBaseURL
    .post(`/v1/admin/service/${page}`, data, {
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

export const retrieveService = async ({page, filter, search, token, id}: any) => {
  const client = await axiosBaseURL
    .get(`/v1/admin/service/${page}/?search=${search}&filter=${filter}&serviceId=${id}`, {
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