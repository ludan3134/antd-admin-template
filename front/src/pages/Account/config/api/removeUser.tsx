import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function removeuser(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/removeUser', {
    method: 'Delete',
    data: {
      ...(options || {}),
    }
  });
}

export const removeUser = async (selectedRows: API.User[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeuser({
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
