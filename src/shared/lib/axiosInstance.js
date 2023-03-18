import axios, {HttpStatusCode} from 'axios';
import {BACKEND_URL, BACKEND_CLIENT_ID} from '@env';

const APP_PREFIX = 'api/v1/';

const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/${APP_PREFIX}`,
});

axiosInstance.interceptors.response.use(config => {
  if (config.status === HttpStatusCode.Ok) {
    return config.data;
  } else {
    const message = `The Request is Failed with ${config.status} http status`;
    throw new Error(message);
  }
});

export default axiosInstance;