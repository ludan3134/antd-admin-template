import React, {useRef, useState} from 'react';
import {ModalForm, ProForm, ProFormRadio, ProFormText} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";
import {ProFormDigit, ProFormInstance, ProFormTreeSelect} from "@ant-design/pro-form/lib";
import {ProFormDependency, ProFormItem, ProFormSwitch} from "@ant-design/pro-form";
import IconSelect from "@/pages/Menu/components/IconSelect";
import {getMenuOption} from "@/pages/Menu/config/api/getMenuOption";
import {upsetMenu} from "@/pages/Menu/config/api/upsetMenu";
import {Button} from "antd";
import {EditFilled, PlusOutlined} from "@ant-design/icons";

const MenUpdateForm: React.FC<API.UpdateFormProps> = ({actionRef, record}) => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false); // 注意这里命名了 setCreateModalOpen

  return (
    <>
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.form',
          defaultMessage: 'Form',
        })}
        size={"large"}
        open={createModalOpen}
        width="400px"
        onFinish={async (value) => {
          const success = await upsetMenu(value as API.Menu);
          if (success) {
            if (actionRef?.current) {
              actionRef.current?.reload();
              return true
            }
          }
        }}
        formRef={formRef}
        submitter={{
          searchConfig: {
            resetText: '重置',
          },
          resetButtonProps: {
            onClick: () => {
              formRef.current?.resetFields();
            },
          },
        }}
        onValuesChange={(changedValues) => {
          if (changedValues.hasOwnProperty("type")) {
            if (formRef.current) {
              formRef.current?.resetFields(['name', 'icon', 'sort', 'parentId', 'api', 'path']);
            }
          }
        }}
        modalProps={{destroyOnClose: true}}
        trigger={
          <Button
            type="primary"
            size={"small"}
            style={{
              backgroundColor: record ? undefined : 'green' // 使用三元运算符来判断背景颜色
            }}
            icon={record ? <EditFilled/> : <PlusOutlined/>} // 使用三元运算符来判断
          >
            <FormattedMessage
              id={record ? 'pages.searchTable.edit' : 'pages.searchTable.createForm'}
              defaultMessage={record ? 'Edit' : 'New'}
            />
          </Button>
        }
        request={async () => {
          return {...record} as API.Menu
        }}
      >
        <ProFormText
          name="id"
          placeholder={intl.formatMessage({
            id: 'menu.table.Id',
            defaultMessage: 'id',
          })}
          hidden={true}
        />
        {/*菜单类型*/}
        <ProFormRadio.Group
          style={{
            marginTop: 55,
          }}
          name="type"
          radioType="button"
          options={[
            {label: intl.formatMessage({id: 'menu.updateForm.type.catalog'}), value: 1},
            {label: intl.formatMessage({id: 'menu.updateForm.type.menu'}), value: 2},
            {label: intl.formatMessage({id: 'menu.updateForm.type.button'}), value: 3}
          ]}
          disabled={record}
          // rules={[{required: true, message: intl.formatMessage({id: 'menu.updateForm.rule.type'})}]}
        />
        {/*菜单名称*/}
        <ProFormText
          name="name"
          placeholder={intl.formatMessage({
            id: 'menu.table.name',
            defaultMessage: 'Name',
          })}
          // rules={[
          //   {required: true, message: intl.formatMessage({id: 'menu.updateForm.rule.name'})},
          //   {
          //     pattern: /^[a-zA-Z]{1,15}$/,
          //     message: intl.formatMessage({id: 'menu.updateForm.rule.name'})
          //   }
          // ]}
        />
        {/*菜单Icon*/}
        <ProFormItem name="icon" shouldUpdate={true}
                     rules={[{required: true, message: intl.formatMessage({id: 'menu.updateForm.rule.icon'})}]}>
          <IconSelect/>
        </ProFormItem>
        {/*菜单排序*/}
        <ProFormDigit
          name="sort"
          width="lg"
          placeholder={intl.formatMessage({
            id: 'menu.table.sort',
            defaultMessage: 'Sort',
          })}/>
        {/*路径 --- 菜单/目录*/}
        <ProFormDependency name={['type']}>
          {({type}) => (
            <ProFormText
              name="path"
              placeholder={intl.formatMessage({
                id: 'menu.table.path',
                defaultMessage: 'Path',
              })}
              hidden={type === 3}
              // rules={[
              //   {
              //     required: type !== 3,
              //     message: intl.formatMessage({id: 'menu.updateForm.rule.path'})
              //   },
              //   {
              //     pattern: /^[a-zA-Z]{1,15}$/,
              //     message: intl.formatMessage({id: 'menu.updateForm.rule.path'})
              //   }
              // ]}
              // transform={(value) => value ? `/${value}` : value}
            />
          )}
        </ProFormDependency>
        {/*上级菜单 -----菜单/按钮*/}
        <ProFormDependency name={['type']}>
          {({type}) => (
            <ProFormTreeSelect
              name="parentId"
              placeholder={intl.formatMessage({
                id: 'menu.table.parentId',
                defaultMessage: 'Parent ID',
              })}
              allowClear
              secondary
              request={async () => {
                const res = await getMenuOption();
                return res.data; // 返回菜单数据
              }}
              rules={[
                {
                  required: type === 2,
                  message: intl.formatMessage({id: 'menu.updateForm.rule.parentId'})
                }
              ]}
              // tree-select args
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
              }}
              hidden={type === 1}
            />
          )}
        </ProFormDependency>
        {/*上级菜单 -----菜单/按钮*/}
        <ProFormDependency name={['type']}>
          {({type}) => (
            <ProFormText
              name="api"
              placeholder={intl.formatMessage({
                id: 'menu.table.api',
                defaultMessage: 'API',
              })}
              hidden={type === 1}
              rules={[
                {
                  required: type === 2,
                  message: intl.formatMessage({id: 'menu.updateForm.rule.api'})
                },
                {
                  pattern: /^[a-zA-Z]{1,15}$/,
                  message: intl.formatMessage({id: 'menu.updateForm.rule.api'})
                }
              ]}
            />
          )}
        </ProFormDependency>
        {/*是否启用*/}
        <ProForm.Group>
          <ProFormSwitch name="hideInMenu"
                         checkedChildren={<FormattedMessage
                           id="menu.updateForm.hideMenu.true"
                           defaultMessage="hideMenu"
                         />}
                         unCheckedChildren={<FormattedMessage
                           id="menu.updateForm.hideMenu.false"
                           defaultMessage="displayMenu"
                         />}
          />
          <ProFormSwitch name="hideChildrenInMenu"
                         checkedChildren={<FormattedMessage
                           id="menu.updateForm.hideChildrenMenu.true"
                           defaultMessage="hideChildrenMenu"
                         />}
                         unCheckedChildren={<FormattedMessage
                           id="menu.updateForm.hideChildrenMenu.false"
                           defaultMessage="displayChildrenMenu"
                         />}
          />
        </ProForm.Group>
      </ModalForm>
    </>
  );
};

export default MenUpdateForm;
//
