import React, {useRef, useState} from 'react';
import {ModalForm} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";
import {ProFormInstance, ProFormTreeSelect} from "@ant-design/pro-form/lib";
import {getMenuOption} from "@/pages/Menu/config/api/getMenuOption";
import {Button} from "antd";
import {CheckOutlined, CloseOutlined, KeyOutlined} from "@ant-design/icons";
import {upsetRoleMenu} from "@/pages/Role/config/api/upsetRoleMenu";
import {getMenuIdByRoleId} from "@/pages/Role/config/api/getMenuIdByRoleId";

const AssignForm: React.FC<API.UpdateFormProps> = ({actionRef, roleId}) => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [menuIds, setMenuIds] = useState<any[]>([]);
  const getAllMenuIds = (data: any[]) => {
    return data.reduce((acc: number[], item) => {
      acc.push(item.id);
      if (item.children && item.children.length > 0) {
        acc = acc.concat(getAllMenuIds(item.children));
      }
      return acc;
    }, []);
  };
  const toggleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    if (isSelectAll) {
      const allMenuIds = menuIds.flatMap(item => [item.id, ...item.children ? getAllMenuIds(item.children) : []]);
      formRef.current?.setFieldsValue({id: allMenuIds});
    } else {
      formRef.current?.setFieldsValue({id: []});
    }
  };


  return (
    <>
      <ModalForm
        title={intl.formatMessage({
          id: 'role.updateForm.assign',
          defaultMessage: 'Assign',
        })}
        size={"large"}
        open={createModalOpen}
        onOpenChange={(open) => {
          formRef?.current?.resetFields
          handleModalOpen(open)
          setIsSelectAll(false)
        }}
        width="400px"
        onFinish={async (value) => {
          const success = await upsetRoleMenu(roleId, value.id);
          if (success) {
            if (actionRef?.current) {
              actionRef.current?.reload();
              return true
            }
          }
        }}
        modalProps={{destroyOnClose: true}}
        request={async () => {
          let res = await getMenuIdByRoleId([roleId])
          return {'id': res.data}; // 返回菜单数据
        }}
        formRef={formRef}
        trigger={
          <Button
            type="primary"
            size={"small"}
            icon={<KeyOutlined/>}
            style={{backgroundColor: 'orange'}} // 添加这一行来设置背景颜色为绿色
          >
            <FormattedMessage
              id="role.updateForm.assign"
              defaultMessage="Assign"
            />
          </Button>
        }
        submitter={{
          // 配置按钮文本
          searchConfig: {
            resetText: intl.formatMessage({
              id: 'pages.searchTable.reset',
              defaultMessage: 'Reset',
            })
          },
          resetButtonProps: {
            onClick: () => {
              formRef.current?.resetFields();
            },
          },
          // 完全自定义整个区域
          render: (props, defaultDoms) => {
            return [
              <Button
                key="selectAll"
                type={"default"}
                onClick={toggleSelectAll}
                danger={isSelectAll}
                icon={isSelectAll ? <CheckOutlined/> : <CloseOutlined/>}
              >
                {isSelectAll ?
                  <FormattedMessage id="pages.searchTable.select.all" defaultMessage="All"/> :
                  <FormattedMessage id="pages.searchTable.select.null" defaultMessage="NULL"/>}
              </Button>,
              ...defaultDoms,
            ];
          },
        }}
      >

        <ProFormTreeSelect
          name="id"
          placeholder="Please select"
          allowClear
          width={330}
          secondary
          request={async () => {
            const res = await getMenuOption();
            setMenuIds(res.data)
            return res.data; // 返回菜单数据
          }}
          multiple
          fieldProps={{
            suffixIcon: null,
            fieldNames: {
              key: 'id',
              label: "name",
              value: "id",
              children: 'children', // 子选项的键名
            },
            filterTreeNode: true,
            showSearch: true,
            autoClearSearchValue: true,
            treeNodeFilterProp: 'name',
            multiple: true,
            treeCheckable: true,
            showCheckedStrategy: "SHOW_PARENT",
            treeDefaultExpandAll: true,
          }}
        />
      </ModalForm>
    </>
  )
    ;
};

export default AssignForm;
