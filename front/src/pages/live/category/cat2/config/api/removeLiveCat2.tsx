import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function removeliveCat2(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/liveCat2/removeLiveCat2', {
    method: 'Delete',
    data: {
      ...(options || {}),
    }
  });
}

export const removeLiveCat2 = async (selectedRows: API.LiveCat2[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeliveCat2({
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
