import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function upsetliveCat4(options?: { [key: string]: any }) {
  return request<API.LiveCat4>('/api/liveCat4/upsetLiveCat4', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    }
  });
}

export const upsetLiveCat4 = async (fields: API.LiveCat4) => {
  const hide = message.loading('正在添加');
  try {
    await upsetliveCat4({...fields});
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
