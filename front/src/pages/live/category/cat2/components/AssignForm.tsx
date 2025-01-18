import React, {useRef, useState} from 'react';
import {ModalForm, ProFormSelect} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";
import {ProFormInstance} from "@ant-design/pro-form/lib";
import {Button} from "antd";
import {CheckOutlined, CloseOutlined, KeyOutlined} from "@ant-design/icons";
import {upsetRoleMenu} from "@/pages/Role/config/api/upsetRoleMenu";
import {getRoleOption} from "@/pages/Role/config/api/getRoleOption";
import {getRoleIdByLiveCat2Id} from "@/pages/Account/config/api/getRoleIdByLiveCat2Id";

const AssignForm: React.FC<API.UpdateFormProps> = ({actionRef, liveCat2Id}) => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [roleIds, setRoleIds] = useState<any[]>([])
  const toggleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    if (isSelectAll) {
      formRef.current?.setFieldsValue({id: roleIds});
    } else {
      formRef.current?.setFieldsValue({id: []});
    }
  };

  return (
    <>
      <ModalForm
        title={intl.formatMessage({
          id: 'liveCat2.updateForm.assign',
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
          let res = await getRoleIdByLiveCat2Id([liveCat2Id])
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
              id="liveCat2.updateForm.assign"
              defaultMessage="AssignRole"
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

        <ProFormSelect
          name="id"
          request={async () => {
            const res = await getRoleOption();
            setRoleIds(res.data.map(item => item.id))
            return res.data; // 返回菜单数据
          }}
          mode="multiple"
          fieldProps={{
            suffixIcon: null,
            fieldNames: {
              key: 'id',
              label: "name",
              value: "id",
            },
            filterTreeNode: true,
            showSearch: true,
            autoClearSearchValue: true,
            treeNodeFilterProp: 'name',

          }}
          placeholder="Please select"
          rules={[{required: true, message: 'Please select'}]}
        />
      </ModalForm>
    </>
  )
    ;
};

export default AssignForm;
