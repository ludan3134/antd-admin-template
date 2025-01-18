import type {ActionType} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button, Drawer, Switch} from 'antd';
import React, {useRef, useState} from 'react';
import {API} from "@/services/ant-design-pro/typings";
import {removeRole} from "@/pages/Role/config/api/removeRole";
import {useAccess} from "@@/exports";
import {DeleteFilled} from "@ant-design/icons";
import {getRole} from "@/pages/Role/config/api/getRole";
import {upsetRole} from "@/pages/Role/config/api/upsetRole";
import RoleUpdateForm from "@/pages/Role/components/UpdateForm";
import AssignForm from "@/pages/Role/components/AssignForm";


const TableList: React.FC = () => {

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Role>();
  const [selectedRowsState, setSelectedRows] = useState<API.Role[]>([]);
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo
  const intl = useIntl();
  const columns: ProColumns<API.Role>[] = [
    {
      title: (
        <FormattedMessage
          id="role.table.name"
          defaultMessage="Name"
        />
      ),
      dataIndex: 'name',
      align: 'center',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="role.table.profile"
          defaultMessage="Profile"
        />
      ),
      dataIndex: 'profile',
      align: 'center',
      hideInSearch: true
    },
    {
      title: <FormattedMessage id="role.table.enable" defaultMessage="Enable"/>,
      dataIndex: 'enable',
      align: 'center',
      valueType: "switch",
      hideInSearch: true,
      render: (text, record) => {
        // text是当前单元格的值，record是当前行的数据
        return <Switch
          key={`${record.enable}`}
          size={"small"}
          checkedChildren={<FormattedMessage
            id="pages.searchTable.enable.true"
            defaultMessage="Enable"
          />}
          unCheckedChildren={<FormattedMessage
            id="pages.searchTable.enable.false"
            defaultMessage="UnEnable"
          />}
          checked={record.enable}
          onChange={async (checked) => {
            await upsetRole({...record, enable: checked});
            actionRef.current?.reload();
          }}
        />;
      },
    },
    {
      title: <FormattedMessage id="role.table.status" defaultMessage="Status"/>,
      dataIndex: 'status',
      align: 'center',
      valueType: "select",
      hidden: true,
      initialValue: "ALL",
      valueEnum: {
        ALL: {
          text: (
            <FormattedMessage id="pages.searchTable.enable.all" defaultMessage="ALL"/>
          ),
          status: 'ALL',
        },
        ON: {
          text: (
            <FormattedMessage id="pages.searchTable.enable.true" defaultMessage="Online"/>
          ),
          status: 'ON',
        },
        OFF: {
          text: (
            <FormattedMessage
              id="pages.searchTable.enable.false"
              defaultMessage="OFF"
            />
          ),
          status: 'Default',
        },
      },
    },

    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateAt"
          defaultMessage="UpdateAt"
        />
      ),
      dataIndex: 'updateAt',
      valueType: 'date',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
      dataIndex: 'option',
      valueType: 'option',
      hidden: !access.upsetRole,
      render: (_, record) => [
        <>
          <RoleUpdateForm actionRef={actionRef} record={{record}} key={"pages.searchTable.edit"}/>
          <AssignForm actionRef={actionRef} roleId={record.id}/>
        </>

      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Role, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        expandable={{
          indentSize: 20, // 缩进的大小，单位为 px
          childrenColumnName: 'children', // 子节点的属性名称
        }}
        options={
          {fullScreen: true, setting: true}
        }
        toolBarRender={() => [
          <RoleUpdateForm key="pages.searchTable.new" actionRef={actionRef} record={null}/>
        ]}
        pagination={{
          defaultPageSize: 2
        }}
        request={getRole}
        columns={columns}
        rowSelection={{
          checkStrictly: false, // 设置为 true 以禁用父子节点关联选择
          onChange: (_, selectedRows) => {
            console.log(selectedRows, selectedRows)
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen"/>{' '}
              <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项"/>
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            danger={true}
            type={"primary"}
            icon={<DeleteFilled/>}
            onClick={async () => {
              await removeRole(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
        </FooterToolbar>
      )}


      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.Role>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns.map(column => {
              // 如果您想要在Drawer中禁用特定的列，可以在这里进行修改
              if (column.dataIndex === 'enable') {
                return {
                  title: <FormattedMessage id="pages.searchTable.enable" defaultMessage="Enable"/>,
                  dataIndex: 'enable',
                  hideInSearch: true,
                  align: 'center',
                  valueEnum: {
                    true: {
                      text: (
                        <FormattedMessage
                          id="pages.searchTable.enable.true"
                          defaultMessage="Running"
                        />
                      ),
                      status: 'Success',
                    },
                    false: {
                      text: (
                        <FormattedMessage id="pages.searchTable.enable.false" defaultMessage="Shut down"/>
                      ),
                      status: 'Error',
                    },
                  },
                }
              }
              return column as ProDescriptionsItemProps<API.Role>[];
            })}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
