// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {API} from "@/services/ant-design-pro/typings";

export async function getOption(
  options?: { [key: string]: any },
) {
  return request<API.User>('/', {
    method: 'POST',
    data: {
      filter: {...options},
    },
  });
}
