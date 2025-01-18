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
import {Button, Drawer, Switch, Tag} from 'antd';
import React, {useRef, useState} from 'react';
import {API} from "@/services/ant-design-pro/typings";
import {removeMenu} from "@/pages/Menu/config/api/removeMenu";
import {useAccess} from "@@/exports";
import MenUpdateForm from "@/pages/Menu/components/UpdateForm";
import {DeleteFilled} from "@ant-design/icons";
import {ProFormTreeSelect} from "@ant-design/pro-form/lib";
import {getMenu} from "@/pages/Menu/config/api/getMenu";
import {getMenuOption} from "@/pages/Menu/config/api/getMenuOption";


const TableList: React.FC = () => {

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Menu>();
  const [selectedRowsState, setSelectedRows] = useState<API.Menu[]>([]);
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo
  const intl = useIntl();

  const columns: ProColumns<API.Menu>[] = [
    // {
    //   title: <FormattedMessage id="menu.table.id" defaultMessage="Id"/>,
    //   dataIndex: 'id',
    //   valueType: 'digit',
    //   align: 'center',
    //   hideInSearch: true,
    //   hidden: true
    // },
    {
      title: <FormattedMessage id="menu.table.type" defaultMessage="Type"/>,
      dataIndex: 'type',
      valueType: 'label',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => {
        let color;
        let typeText;
        switch (record.type) {
          case 1:
            color = 'geekblue'; // 目录色
            typeText = intl.formatMessage({id: 'menu.updateForm.type.catalog'});
            break;
          case 2:
            color = 'green';    // 菜单色
            typeText = intl.formatMessage({id: 'menu.updateForm.type.menu'});
            break;
          case 3:
            color = 'purple';   // 按钮色
            typeText = intl.formatMessage({id: 'menu.updateForm.type.button'});
            break;
          default:
            color = 'default';  // 默认颜色
            typeText = '未知';
            break;
        }
        return (
          <Tag color={color}>
            {typeText}
          </Tag>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="menu.table.name"
          defaultMessage="name"
        />
      ),
      dataIndex: 'id',
      valueType: "select",
      align: 'center',
      hidden: true,
      renderFormItem: (_, fieldConfig, form) => {
        return (
          <ProFormTreeSelect
            name="id"
            placeholder={intl.formatMessage({
              id: 'menu.table.name',
              defaultMessage: 'Please enter the name of menu!',
            })}
            allowClear
            secondary
            request={async () => {
              const res = await getMenuOption();
              return res.data;
            }}
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
          />
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="menu.table.name"
          defaultMessage="Menu name"
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
      hideInSearch: true
    },
    {
      title: <FormattedMessage id="menu.table.sort" defaultMessage="Sort"/>,
      dataIndex: 'sort',
      valueType: 'indexBorder',
      align: 'center',
      hideInSearch: true
    },
    {
      title: (
        <FormattedMessage
          id="menu.table.hideChildrenMenu"
          defaultMessage="hideChildrenMenu"
        />
      ),
      dataIndex: 'hideChildrenInMenu',
      valueType: "switch",
      hideInSearch: true,
      align: 'center',
      render: (text, record) => {
        // text是当前单元格的值，record是当前行的数据
        return <Switch
          key={`${record.hideChildrenMenu}`}
          size={"small"}
          checkedChildren={<FormattedMessage
            id="menu.updateForm.hideChildrenMenu.true"
            defaultMessage="hideChildrenMenu"
          />}
          unCheckedChildren={<FormattedMessage
            id="menu.updateForm.hideChildrenMenu.false"
            defaultMessage="displayChildrenMenu"
          />}
          disabled={true}
          checked={record.hideChildrenInMenu}
        />;
      },
    },
    {
      title: (
        <FormattedMessage
          id="menu.table.hideMenu"
          defaultMessage="hideMenu"
        />
      ),
      dataIndex: 'hideInMenu',
      valueType: "switch",
      hideInSearch: true,
      align: 'center',
      render: (text, record) => {
        // text是当前单元格的值，record是当前行的数据
        return <Switch
          key={`${record.hideInMenu}`}
          size={"small"}
          checkedChildren={<FormattedMessage
            id="menu.updateForm.hideMenu.true"
            defaultMessage="hideMenu"
          />}
          unCheckedChildren={<FormattedMessage
            id="menu.updateForm.hideMenu.false"
            defaultMessage="displayMenu"
          />}
          disabled={true}
          checked={record.hideInMenu}
        />;
      },
    },
    {
      title: (
        <FormattedMessage
          id="menu.table.api"
          defaultMessage="API"
        />
      ),
      dataIndex: 'api',
      align: 'center',
      hideInSearch: true
    },


    {
      title: (
        <FormattedMessage
          id="menu.table.path"
          defaultMessage="Path"
        />
      ),
      dataIndex: 'path',
      hideInSearch: true,
      align: 'center'
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
      hidden: !access.upsetMenu,
      render: (_, record) => [

        <MenUpdateForm actionRef={actionRef} record={record} key={"pages.searchTable.edit"}/>

      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Menu, API.PageParams>
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
          <MenUpdateForm actionRef={actionRef} record={null} key={"pages.searchTable.new"}/>
        ]}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        request={getMenu}
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
              await removeMenu(selectedRowsState);
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
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.Menu>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
//
