import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function removeliveCat1(options?: { [key: string]: any }) {
  return request<Record<string, any>>('http://192.168.3.41:8090/api.ks.v1.KService/DeleteMainClass', {
    method: 'Post',
    data: {
      ...(options || {}),
    }
  });
}

export const removeLiveCat1 = async (selectedRows: API.LiveCat1[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeliveCat1({
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
