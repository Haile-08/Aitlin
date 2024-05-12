import axiosBaseURL from "../config/axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addClient = async ({ data, token }:any) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const retrieveClients = async ({page, search, token}: any) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const editServiceData = async ({ data, token, page }: any) => {
  const client = await axiosBaseURL
    .put(`/v1/admin/service/${page}`, data, {
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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const retrieveASingleService = async ({serviceId, token}: any) => {
  const client = await axiosBaseURL
    .get(`/v1/admin/service/get/?serviceId=${serviceId}`, {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteBill = async ({id, token}: any) => {
  const client = await axiosBaseURL
    .delete(`/v1/admin/service/bill/${id}`, {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteBinnacle = async ({id, token}: any) => {
  const client = await axiosBaseURL
    .delete(`/v1/admin/service/binnacle/${id}`, {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteNurse = async ({id, token}: any) => {
  const client = await axiosBaseURL
    .delete(`/v1/admin/service/nurses/${id}`, {
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