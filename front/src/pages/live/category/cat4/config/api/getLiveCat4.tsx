// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {API} from "@/services/ant-design-pro/typings";

export async function getLiveCat4(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.LiveCat4>('http://47.76.127.2:8090/api.ks.v1.KService/QueryChannelList', {
    method: 'POST',
    data: {...params, pageSize: undefined, current: undefined},
    params: {
      pageSize: params.pageSize,
      current: params.current,
    },
    ...(options || {}),
  });
}
