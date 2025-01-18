import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function upsetrole(options?: { [key: string]: any }) {
  return request<API.Role>('/api/role/upsetRole', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    }
  });
}

export const upsetRole = async (fields: API.Role) => {
  const hide = message.loading('正在添加');
  try {
    await upsetrole({...fields});
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
