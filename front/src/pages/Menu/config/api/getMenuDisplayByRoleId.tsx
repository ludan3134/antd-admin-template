import {MenuDataItem} from "@ant-design/pro-components";
import {request} from "@umijs/max";

/** 获取当前的用户 GET /api/currentUserMenus */
export async function getMenuDisplayByRoleId(ids: number[], options?: { [key: string]: any }) {
  return request<MenuDataItem[]>('/api/menu/getMenuDisplayByRoleId', {
    method: 'GET',
    params: {ids: ids}
  });
}
