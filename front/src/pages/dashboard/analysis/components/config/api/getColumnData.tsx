// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {API} from "@/services/ant-design-pro/typings";

export async function getColumnData(
  options?: { [key: string]: any },
) {
  return request<API.User>('http://192.168.3.41:8090/api.ks.v1.KService/QueryAllLinkStatusInfo', {
    method: 'POST',
    data: {
      filter: {...options},
    },
  });
}
