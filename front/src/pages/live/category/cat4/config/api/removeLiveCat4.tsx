import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function removeliveCat4(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/liveCat4/removeLiveCat4', {
    method: 'Delete',
    data: {
      ...(options || {}),
    }
  });
}

export const removeLiveCat4 = async (selectedRows: API.LiveCat4[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeliveCat4({
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
