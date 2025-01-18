import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function updateLogRecord(options?: { [key: string]: any }) {
  return request<API.LiveCat1>('/api/demo', {
    method: 'POST',
    data: {
      ...(options || {}),
    }
  });
}

export const updatelogRecord = async (fields: API.LogRecord) => {
  const hide = message.loading('正在添加');
  try {
    await updateLogRecord({record:{...fields}});
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
