import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function removelogRecord(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/demo', {
    method: 'Post',
    data: {
      ...(options || {}),
    }
  });
}

export const removeLogRecord = async (selectedRows: API.LiveCat1[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removelogRecord({
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
