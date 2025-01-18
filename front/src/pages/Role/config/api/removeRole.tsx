import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function removerole(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/role/removeRole', {
    method: 'Delete',
    data: {
      ...(options || {}),
    }
  });
}

export const removeRole = async (selectedRows: API.Role[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removerole({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};
