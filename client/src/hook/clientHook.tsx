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
        return resData.data;
      })
      .catch(function (err) {
        console.log(err);
      });
    return client;
};

export const retrieveClientNotification = async ({clientId, token}: { clientId: string, token: string}) => {
    const client = await axiosBaseURL
      .get(`/v1/client/notification/?clientId=${clientId}`, {
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
export const updateNotificationData = async ({ data, token }: any) => {
  const client = await axiosBaseURL
    .put(`/v1/client/notification`, data, {
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
export const updateNotificationStatus = async ({ data, token }: any) => {
  const client = await axiosBaseURL
    .put(`/v1/client/document/notification`, data, {
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
