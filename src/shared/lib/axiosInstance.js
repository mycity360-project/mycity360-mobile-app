import axios, {HttpStatusCode} from 'axios';
import {BACKEND_URL} from '../constants/env';

const APP_PREFIX = 'api/v1/';

const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/${APP_PREFIX}`,
});

// axiosInstance.defaults.timeout = 300000;

axiosInstance.interceptors.response.use(config => {
  if (
    config.status === HttpStatusCode.Ok ||
    config.status === HttpStatusCode.Created
  ) {
    return config.data;
  } else {
    console.log(config, '19');
    throw new Error(config);
  }
});

export default axiosInstance;
