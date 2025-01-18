import {request} from "@umijs/max";
import Role from "@/pages/Role";

/** 获取当前的用户 GET /api/currentUserRoles */
export async function getFileByUuId(id: string, options?: { [key: string]: any }) {
  return request<Role[]>('/api/ftp/download', {
    method: 'GET',
    params: {uuid: id},
    responseType : 'blob', // 必须注明返回二进制流
  });
}
