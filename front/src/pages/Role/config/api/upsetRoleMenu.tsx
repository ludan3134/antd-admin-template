import {request} from "@umijs/max";
import Role from "@/pages/Role";

/** 获取当前的用户 GET /api/currentUserRoles */
export async function upsetRoleMenu(id: number, ids: number[], options?: { [key: string]: any }) {
  return request<Role[]>('/api/role/upsetRoleMenu', {
    method: 'POST',
    data: {
      id: [id],
      ids: ids
    },
  });
}
