import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function upsetliveCat3(options?: { [key: string]: any }) {
  return request<API.LiveCat3>('/api/liveCat3/upsetLiveCat3', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    }
  });
}

export const upsetLiveCat3 = async (fields: API.LiveCat3) => {
  const hide = message.loading('正在添加');
  try {
    await upsetliveCat3({...fields});
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
