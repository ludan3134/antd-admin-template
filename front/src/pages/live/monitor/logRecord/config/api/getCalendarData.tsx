// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {API} from "@/services/ant-design-pro/typings";

export async function getCalendarData(
  options?: { [key: string]: any },
) {
  return request<API.User>('/api/demo', {
    method: 'POST',
    data: {
      filter: {...options},
    },
  });
}
