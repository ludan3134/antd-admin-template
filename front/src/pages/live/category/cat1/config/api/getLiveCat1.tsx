// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {API} from "@/services/ant-design-pro/typings";

export async function getLiveCat1(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.LiveCat1>('http://192.168.3.41:8090/api.ks.v1.KService/QueryMainClassList', {
    method: 'POST',
    data: {
      filter:{...params,pageSize: undefined, current: undefined},
    },
    params: {
      pageSize: params.pageSize,
      current: params.current,
    },
    ...(options || {}),
  });
}
