import {request} from "@umijs/max";
import {API} from "@/services/ant-design-pro/typings";

export async function getMenuOption(
  options?: { [key: string]: any },
) {
  return request<API.Menu>('/api/menu/getMenuOption', {
    method: 'GET',
    ...(options || {}),
  });
}

