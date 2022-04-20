import request, { METHOD_TYPE } from './axios';

export const fetchConvertedCPS = async (cps: string) => {
  return await request(METHOD_TYPE.GET, `https://d1u88ejxyqw3o6.cloudfront.net/ads/v1/debug/cps/${cps}`);
};
