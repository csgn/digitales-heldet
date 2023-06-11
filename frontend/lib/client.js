import axios from "axios";

export const fetcher = (url, body) =>
  axios.get(url, body).then((res) => res.data);
export const poster = (url, body) =>
  axios.post(url, body).then((res) => res.data);
export const remover = (url, body) =>
  axios.delete(url, body).then((res) => res.data);
