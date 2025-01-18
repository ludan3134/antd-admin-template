import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function upsetuser(options?: { [key: string]: any }) {
  return request<API.User>('/api/user/upsetUser', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    }
  });
}

export const upsetUser = async (fields: API.User) => {
  const hide = message.loading('正在添加');
  try {
    await upsetuser({...fields});
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
