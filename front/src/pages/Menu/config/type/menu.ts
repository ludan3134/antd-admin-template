export type Menu = {
  id?: number;
  parentId?: number;
  deleted?: boolean;
  icon?: string;
  name?: string;
  sort?: number;
  path?: string;
  api?: string;
  updateAt?: number;
  hideInMenu?:boolean,
  hideChildrenInMenu?:boolean,
  children?: Menu[];
};
