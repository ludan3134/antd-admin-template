import type {ActionType} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useLocation} from '@umijs/max';
import {Button, Drawer} from 'antd';
import React, {useRef, useState} from 'react';
import {API} from "@/services/ant-design-pro/typings";
import {useAccess, useMatch} from "@@/exports";
import { history } from 'umi';

import {ArrowLeftOutlined, DeleteFilled, DownloadOutlined, ReloadOutlined} from "@ant-design/icons";
import LiveCat4UpdateForm from "@/pages/Account/components/UpdateForm";
import {removeLiveCat4} from "@/pages/live/category/cat4/config/api/removeLiveCat4";
import {getLiveCat4} from "@/pages/live/category/cat4/config/api/getLiveCat4";



const TableList: React.FC = () => {

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.LiveCat4>();
  const [selectedRowsState, setSelectedRows] = useState<API.LiveCat4[]>([]);
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo
  const intl = useIntl();
  const location = useLocation();
  let match = useMatch(location.pathname);
  const { search } = useLocation();
  console.log("search123456",search)
  let searchParams = new URLSearchParams(search);

  console.log("ccc",searchParams.get("id"))

  const columns: ProColumns<API.LiveCat4>[] = [
    {
      title: <FormattedMessage id="menu.table.id" defaultMessage="Id"/>,
      dataIndex: 'subClassId',
      valueType: 'digit',
      align: 'center',
      hidden: true,
      hideInForm:true,
      initialValue:searchParams.get("id"),
      readonly:true
    },
    {
      title: (
        <FormattedMessage
          id="liveCat4.table.name"
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
          id="liveCat4.table.zhName"
          defaultMessage="zhName"
        />
      ),
      dataIndex: 'zhName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: (
        <FormattedMessage
          id="liveCat4.table.sort"
          defaultMessage="Sort"
        />
      ),
      dataIndex: 'sort',
      valueType: 'indexBorder',
      align: 'center',
      hideInSearch: true,
    },

    {
      title: (
        <FormattedMessage
          id="liveCat4.table.isUse"
          defaultMessage="是否使用"
        />
      ),
      dataIndex: 'isUse',
      align: 'center',
      hideInSearch: true
    },
    {
      title: (
        <FormattedMessage
          id="liveCat4.table.keyWord"
          defaultMessage="关键字"
        />
      ),
      dataIndex: 'keyword',
      align: 'center',
      hideInSearch: true
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
      dataIndex: 'option',
      valueType: 'option',
      // hidden: !access.upsetLiveCat4,
      render: (_, record) => [
        <>

          <LiveCat4UpdateForm actionRef={actionRef} record={record} key={"pages.searchTable.edit"}/>
          {/*<Button type="primary" size={"small"}*/}
          {/*        icon={<DownSquareOutlined/>}*/}
          {/*        style={{backgroundColor: 'gray'}}*/}
          {/*        key={"pages.searchTable.sub"}*/}
          {/*        onClick={() => {*/}
          {/*          let url =*/}
          {/*            match?.pathname === '/' ? '' : match?.pathname.substring(0, match.pathname.lastIndexOf('/'));*/}
          {/*          console.log("url2",url+"/cat1/cat2")*/}
          {/*          return history.push(`${url}/cat1/cat2`);*/}
          {/*        }}*/}

          {/*>*/}
          {/*  <FormattedMessage id="pages.searchTable.sub" defaultMessage="Sub"/>*/}
          {/*</Button>*/}
          <Button type="primary" size={"small"}
                  icon={<DownloadOutlined/>}
                  style={{backgroundColor: 'orange'}}
                  key={"pages.searchTable.import"}

          >
            <FormattedMessage id="pages.searchTable.import" defaultMessage="Import"/>
          </Button>
          <Button type="primary" size={"small"}
                  icon={<ReloadOutlined/>}
                  style={{backgroundColor: 'yellowgreen'}}
                  key={"pages.searchTable.createCache"}

          >
            <FormattedMessage id="pages.searchTable.createCache" defaultMessage="createCache"/>
          </Button>

        </>

      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.LiveCat4, API.PageParams>
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
          <>
            <LiveCat4UpdateForm actionRef={actionRef} record={null} key={"pages.searchTable.new"}/>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                // let url =
                //   match?.pathname === '/' ? '' : match?.pathname.substring(0, match.pathname.lastIndexOf('/'));
                // return history.push({
                //     pathname: `/Live/category/cat1/cat2`,
                //     search: `?id=${777}`,
                //   }
                // );
                history.back();
              }}
            >
              返回上一级
            </Button>
          </>
        ]}
        pagination={{
          defaultPageSize: 2
        }}
        request={getLiveCat4}
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
              await removeLiveCat4(selectedRowsState);
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
          <ProDescriptions<API.LiveCat4>
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
              return column as ProDescriptionsItemProps<API.LiveCat4>[];
            })}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
