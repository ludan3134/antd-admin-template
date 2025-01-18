import {request} from "@@/exports";

export async function uploadFile(url: string) {
  return request(url, {
    method: 'GET',
    responseType: 'blob',
    changeOrigin: true,
  });
}
