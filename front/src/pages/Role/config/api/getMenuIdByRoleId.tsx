import {request} from "@umijs/max";
import Role from "@/pages/Role";

/** 获取当前的用户 GET /api/currentUserRoles */
export async function getMenuIdByRoleId(ids: number[], options?: { [key: string]: any }) {
  return request<Role[]>('/api/role/getMenuIdByRoleId', {
    method: 'GET',
    params: {ids: ids}
  });
}
