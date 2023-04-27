import axios, {HttpStatusCode} from 'axios';
import {BACKEND_URL} from '../constants/env';

const APP_PREFIX = 'api/v1/';

const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/${APP_PREFIX}`,
});

axiosInstance.interceptors.response.use(config => {
  if (
    [
      HttpStatusCode.Accepted,
      HttpStatusCode.Created,
      HttpStatusCode.NoContent,
      HttpStatusCode.Ok,
      HttpStatusCode.NonAuthoritativeInformation,
    ].includes(config.status)
  ) {
    return config?.data;
  } else {
    throw new Error(config);
  }
});

export default axiosInstance;
