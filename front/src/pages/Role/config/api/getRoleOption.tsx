import {request} from "@umijs/max";
import {API} from "@/services/ant-design-pro/typings";

export async function getRoleOption(
  options?: { [key: string]: any },
) {
  return request<API.Role>('/api/role/getRoleOption', {
    method: 'GET',
    ...(options || {}),
  });
}

