import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function upsetmenu(options?: { [key: string]: any }) {
  return request<API.Menu>('/api/menu/upsetMenu', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    }
  });
}

export const upsetMenu = async (fields: API.Menu) => {
  const hide = message.loading('正在添加');
  try {
    await upsetmenu({...fields});
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
