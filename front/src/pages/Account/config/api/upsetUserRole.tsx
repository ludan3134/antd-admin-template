import {request} from "@umijs/max";
import Role from "@/pages/Role";

/** 获取当前的用户 GET /api/currentUserRoles */
export async function upsetUserRole(id: number, ids: number[], options?: { [key: string]: any }) {
  return request<Role[]>('/api/user/upsetUserRole', {
    method: 'POST',
    data: {
      id: [id],
      ids: ids
    },
  });
}
