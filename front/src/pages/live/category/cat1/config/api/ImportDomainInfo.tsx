// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {API} from "@/services/ant-design-pro/typings";

export async function ImportDomainInfo(
  options?: { [key: string]: any },
) {
  return request<API.LiveCat1>('http://192.168.3.41:8090/api.ks.v1.KService/ImportDomainInfo', {
    method: 'POST',
    // 默认传空对象
    data: {
      ...(options || {}),
    }
  });
}
