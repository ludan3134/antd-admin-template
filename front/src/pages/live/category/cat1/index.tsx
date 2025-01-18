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
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import {API} from "@/services/ant-design-pro/typings";
import {useAccess, useMatch} from "@@/exports";
import {ArrowRightOutlined, DeleteFilled, DownloadOutlined, ReloadOutlined} from "@ant-design/icons";
import {removeLiveCat1} from "@/pages/live/category/cat1/config/api/removeLiveCat1";
import {getLiveCat1} from "@/pages/live/category/cat1/config/api/getLiveCat1";
import LiveCat1UpdateForm from "@/pages/live/category/cat1/components/UpdateForm";
import {createCache} from "@/pages/live/category/cat1/config/api/createCache";
import {ImportDomainInfo} from "@/pages/live/category/cat1/config/api/ImportDomainInfo";


const TableList: React.FC = () => {

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.LiveCat1>();
  const [selectedRowsState, setSelectedRows] = useState<API.LiveCat1[]>([]);
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo
  const intl = useIntl();
  const location = useLocation();
  let match = useMatch(location.pathname);

  const columns: ProColumns<API.LiveCat1>[] = [
    {
      title: (
        <FormattedMessage
          id="liveCat1.table.name"
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
          id="liveCat1.table.sort"
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
          id="liveCat1.table.comboName"
          defaultMessage="comboName"
        />
      ),
      dataIndex: 'comboName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateAt"
          defaultMessage="UpdateAt"
        />
      ),
      dataIndex: 'updated',
      valueType: 'date',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
      dataIndex: 'option',
      valueType: 'option',
      // hidden: !access.upsetLiveCat1,
      render: (_, record) => [
        <>
          <LiveCat1UpdateForm actionRef={actionRef} record={record} key={"pages.searchTable.edit"}/>
          <Button type="primary" size={"small"}
                  icon={<ArrowRightOutlined/>}
                  style={{backgroundColor: 'gray'}}
                  key={"pages.searchTable.sub"}
                  onClick={() => {
                    let url =
                      match?.pathname === '/' ? '' : match?.pathname.substring(0, match.pathname.lastIndexOf('/'));
                    return history.push({
                        pathname: `${url}/cat1/cat2`,
                        search: `?id=${record.id}`,
                      }
                    );
                  }}
          >
            <FormattedMessage id="pages.searchTable.sub" defaultMessage="Sub"/>
          </Button>
          <Button type="primary" size={"small"}
                  icon={<DownloadOutlined/>}
                  style={{backgroundColor: 'orange'}}
                  key={"pages.searchTable.createCache"}
                  onClick={async () => {
                    let res = await createCache({record: record})
                    res?.success?message.success(res.errorMessage) : message.error(res.errorMessage)
                  }}

          >
            <FormattedMessage id="pages.searchTable.import" defaultMessage="Import"/>
          </Button>
          <Button type="primary" size={"small"}
                  icon={<ReloadOutlined/>}
                  style={{backgroundColor: 'yellowgreen'}}
                  key={"liveCat1.table.createCache"}
                  onClick={async () => {
                    let res = await ImportDomainInfo({record: record})
                    res?.success?message.success(res.errorMessage) : message.error(res.errorMessage)

                  }}

          >
            <FormattedMessage id="liveCat1.table.createCache" defaultMessage="createCache"/>
          </Button>

        </>

      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.LiveCat1, API.PageParams>
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
          <LiveCat1UpdateForm actionRef={actionRef} record={null} key={"pages.searchTable.new"}/>
        ]}
        pagination={{
          defaultPageSize: 10
        }}
        request={getLiveCat1}
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
              await removeLiveCat1(selectedRowsState);
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
          <ProDescriptions<API.LiveCat1>
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
              return column as ProDescriptionsItemProps<API.LiveCat1>[];
            })}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
