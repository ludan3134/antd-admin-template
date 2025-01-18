// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {API} from "@/services/ant-design-pro/typings";

export async function getCalendarData(
  options?: { [key: string]: any },
) {
  return request<API.User>('http://47.76.127.2:8191/api.ks.v1.KService/QueryRecordSummaryInfoByDate', {
    method: 'POST',
    data: {
      filter: {...options},
    },
  });
}
