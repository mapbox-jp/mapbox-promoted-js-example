import axios from 'axios';

export const METHOD_TYPE = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

export type MethodType = typeof METHOD_TYPE[keyof typeof METHOD_TYPE];

export const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' });

export const axiosBase = (
  method: MethodType,
  url: string,
  options: {
    data?: any;
    config?: any;
  } = {}
) => {
  const { data, config } = options;
  const headers = { 'Content-Type': 'application/json' };
  const updateConfig = Object.assign({ headers }, config || {});
  switch (method) {
    default:
    case METHOD_TYPE.GET: {
      return axiosInstance.get(url, updateConfig);
    } case METHOD_TYPE.POST: {
      return axiosInstance.post(url, data, updateConfig);
    } case METHOD_TYPE.PUT: {
      return axiosInstance.put(url, data, updateConfig);
    } case METHOD_TYPE.DELETE: {
      return axiosInstance.delete(url, updateConfig);
    }
  }
};

export const request = async (
  method: MethodType,
  url: string,
  data?: any,
  options?: { config: any }
) => {
  return new Promise(async (resolve, reject) => {
    const updatedOptions = Object.assign({ data }, options || {});
    await axiosBase(method, url, updatedOptions).then((response) => {
      resolve(response.data);
    }).catch(error => {
      reject(error);
    });
  });
};

export default request;
