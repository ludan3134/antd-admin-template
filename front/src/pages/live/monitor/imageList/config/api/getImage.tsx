// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {API} from "@/services/ant-design-pro/typings";

export async function getImage(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.User>('/api/demo', {
    method: 'POST',
    data: {filter:{...params, pageSize: undefined, current: undefined,...options}},
    params: {
      pageSize: params.pageSize,
      current: params.current,
    },
    ...(options || {}),
  });
}
