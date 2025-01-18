import type {ActionType} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import {FormattedMessage, history, useIntl, useLocation} from '@umijs/max';
import {Button, Drawer} from 'antd';
import React, {useRef, useState} from 'react';
import {API} from "@/services/ant-design-pro/typings";
import {useAccess, useMatch} from "@@/exports";
import {ArrowLeftOutlined, DeleteFilled, DownloadOutlined, DownSquareOutlined, ReloadOutlined} from "@ant-design/icons";
import LiveCat2UpdateForm from "@/pages/Account/components/UpdateForm";
import {getLiveCat2} from "@/pages/live/category/cat2/config/api/geLiveCat2";
import {removeLiveCat2} from "@/pages/live/category/cat2/config/api/removeLiveCat2";


const TableList: React.FC = () => {

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.LiveCat2>();
  const [selectedRowsState, setSelectedRows] = useState<API.LiveCat2[]>([]);
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo
  const intl = useIntl();
  const location = useLocation();
  let match = useMatch(location.pathname);
  const {search} = useLocation();
  console.log("search123456", search)
  let searchParams = new URLSearchParams(search);
  console.log("aaa", searchParams.get("id"))

  const columns: ProColumns<API.LiveCat2>[] = [
    {
      title: <FormattedMessage id="menu.table.id" defaultMessage="Id"/>,
      dataIndex: 'mainClassId',
      valueType: 'digit',
      align: 'center',
      hidden: true,
      hideInForm: true,
      initialValue: searchParams.get("id"),
      readonly: true
    },
    {
      title: (
        <FormattedMessage
          id="liveCat2.table.name"
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
    // {
    //   title: (
    //     <FormattedMessage
    //       id="liveCat2.table.zhName"
    //       defaultMessage="zhName"
    //     />
    //   ),
    //   dataIndex: 'zhName',
    //   align: 'center',
    //   hideInSearch: true
    // },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="liveCat2.table.sort"
    //       defaultMessage="Sort"
    //     />
    //   ),
    //   dataIndex: 'sort',
    //   valueType: 'indexBorder',
    //   align: 'center',
    //   hideInSearch: true,
    // },
    //
    // {
    //   title: (
    //     <FormattedMessage
    //       id="liveCat2.table.isUse"
    //       defaultMessage="是否使用"
    //     />
    //   ),
    //   dataIndex: 'isUse',
    //   align: 'center',
    //   hideInSearch: true
    // },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="liveCat2.table.keyWord"
    //       defaultMessage="关键字"
    //     />
    //   ),
    //   dataIndex: 'keyword',
    //   align: 'center',
    //   hideInSearch: true
    // },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
      dataIndex: 'option',
      valueType: 'option',
      // hidden: !access.upsetLiveCat2,
      render: (_, record) => [
        <>
          <LiveCat2UpdateForm actionRef={actionRef} record={record} key={"pages.searchTable.edit"}/>
          <Button type="primary" size={"small"}
                  icon={<DownSquareOutlined/>}
                  style={{backgroundColor: 'gray'}}
                  key={"pages.searchTable.sub"}
                  onClick={() => {
                    let url =
                      match?.pathname === '/' ? '' : match?.pathname.substring(0, match.pathname.lastIndexOf('/'));
                    return history.push({
                        pathname: `${url}/cat2/cat3`,
                        search: `?id=${853}`,
                      }
                    );
                  }}
          >
            <FormattedMessage id="pages.searchTable.sub" defaultMessage="Sub"/>
          </Button>
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
      <ProTable<API.LiveCat2, API.PageParams>
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
            <Button
              icon={<ArrowLeftOutlined/>}
              key={"aa"}
              onClick={() => {
                history.back();
              }}
            >
              返回上一级
            </Button>
            <LiveCat2UpdateForm actionRef={actionRef} record={null} key={"pages.searchTable.new"}/>
          </>
        ]}
        pagination={{
          defaultPageSize: 2
        }}
        request={getLiveCat2}
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
              await removeLiveCat2(selectedRowsState);
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
          <ProDescriptions<API.LiveCat2>
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
              return column as ProDescriptionsItemProps<API.LiveCat2>[];
            })}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
//

