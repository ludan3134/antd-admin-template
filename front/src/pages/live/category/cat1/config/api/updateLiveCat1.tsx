import {message} from "antd";
import {request} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";


async function updateLiveCat1(options?: { [key: string]: any }) {
  return request<API.LiveCat1>('http://192.168.3.41:8090/api.ks.v1.KService/UpdateMainClass', {
    method: 'POST',
    data: {
      ...(options || {}),
    }
  });
}

export const updateliveCat1 = async (fields: API.LiveCat1) => {
  const hide = message.loading('正在添加');
  try {
    await updateLiveCat1({record:{...fields}});
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
