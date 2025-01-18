import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function upsetliveCat2(options?: { [key: string]: any }) {
  return request<API.LiveCat2>('/api/liveCat2/upsetLiveCat2', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    }
  });
}

export const upsetLiveCat2 = async (fields: API.LiveCat2) => {
  const hide = message.loading('正在添加');
  try {
    await upsetliveCat2({...fields});
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
