import axios from "axios";
import Cookies from "js-cookie";
// axios.defaults.baseURL = window.__config__.API_URL;
import { message } from "antd";
axios.defaults.baseURL = "http://localhost:4200/";
const postReq = (url, data, authToken) => {
  if (authToken)
    return axios.post(url, data, { headers: { Authorization: authToken } });
  return axios.post(url, data);
};

const putReq = (url, data, authToken) =>
  axios.put(url, data, { headers: { Authorization: authToken } });

const patchReq = (url, data, authToken) =>
  axios.patch(url, data, { headers: { Authorization: authToken } });

const getReq = (url, authToken) => {
  return axios.get(url, { headers: { Authorization: authToken } });
};

const deleteReq = (url, data = null, headerData) =>
  axios.delete(url, { headers: { Authorization: headerData }, params: data });

const throwNotification = (type, title, description) => {
  console.log(type, "type", title, "title", description, "description");
};

export { postReq, getReq, putReq, patchReq, deleteReq, throwNotification };

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      if (
        error?.response?.data?.error === "Invalid segment encoding" ||
        error?.response?.data?.error === "revoked token" ||
        error?.response?.data?.error === "Signature verification raised" ||
        error?.response?.data?.error === "nil user"
      ) {
        const path = window.location.pathname.split("/");
        if (path.length >= 3) {
          Cookies.remove(`${path[2]}`);
          window.location.href = window.location.origin + "/sign-in";
        }
        if (Cookies.get("authToken")) {
          Cookies.remove("authToken");
          window.location.href = window.location.origin + "/sign-in";
        }
      }
      return Promise.reject(error);
    }
    if (
      error?.response?.status === 401 ||
      error?.response?.status === 400 ||
      error?.response?.status === 404 ||
      error?.response?.status === 422 ||
      error?.response?.status === 500
    ) {
      message.error(error?.response?.data?.message);
      return Promise.reject(error);
    }
    console.log(error);
    return Promise.reject(error);
  }
);
