import { resetDataTypes, userDataTypes } from '../@types';
import axiosBaseURL from '../config/axios';

export const loginUser = async (user: userDataTypes) =>{
  const data = await axiosBaseURL.post(
    '/v1/login', user, { 
      withCredentials: true 
    }).then(function (res) {
      return res;
    })
    .then(function (resData) {
      return resData.data;
    })
    .catch(function (err) {
      console.log(err);
    });

    return data;
};

export const requestPasswordReset = async (email: string) =>{
  const data = await axiosBaseURL.post(
    '/v1/passwordResetRequest', {email}, { 
      withCredentials: true 
    }).then(function (res) {
      return res;
    })
    .then(function (resData) {
      return resData.data;
    })
    .catch(function (err) {
      console.log(err);
    });

    return data;
};


export const passwordReset = async (user: resetDataTypes) =>{
  const data = await axiosBaseURL.post(
    '/v1/resetPassword', user, { 
      withCredentials: true 
    }).then(function (res) {
      return res;
    })
    .then(function (resData) {
      return resData.data;
    })
    .catch(function (err) {
      console.log(err);
    });

    return data;
};