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
import {Button, Drawer, message, Upload} from 'antd';
import React, {useRef, useState} from 'react';
import {API} from "@/services/ant-design-pro/typings";
import {useAccess, useMatch} from "@@/exports";
import {ArrowRightOutlined, DeleteFilled, UploadOutlined} from "@ant-design/icons";
import {getLogRecord} from "@/pages/live/monitor/logRecord/config/api/getLogRecord";
import LogRecordUpdateForm from "@/pages/live/monitor/logRecord/components/UpdateForm";
import {removeLogRecord} from "@/pages/live/monitor/logRecord/config/api/removeLogRecord";
import StatisticsForm from "@/pages/live/monitor/logRecord/components/StatisticsForm";


const TableList: React.FC = () => {

    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.LogRecord>();
    const [selectedRowsState, setSelectedRows] = useState<API.LogRecord[]>([]);
    const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo
    const intl = useIntl();
    const location = useLocation();
    let match = useMatch(location.pathname);
    const [loadings, setLoadings] = useState<boolean>(false);

    const columns: ProColumns<API.LogRecord>[] = [
        {
          title: (
            <FormattedMessage
              id="logRecord.table.name"
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
              id="logRecord.table.fileName"
              defaultMessage="fileName"
            />
          ),
          dataIndex: 'filename',
          align: 'center',
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
          render: (text, record) => {
            const dateObject = new Date(record.updateAt * 1000); // 将秒转换为毫秒
            const chineseDateTimeString = dateObject.toLocaleString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            });
            return (
              <span>{chineseDateTimeString}</span>
            );
          },
        },
        {
          title:
            <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
          dataIndex:
            'option',
          valueType:
            'option',
          hidden:
            !access.upsetLogRecord,
          render:
            (_, record) => [
              <>
                <LogRecordUpdateForm actionRef={actionRef} record={record} key={"pages.searchTable.edit"}/>
                <Button type="primary" size={"small"}
                        icon={<ArrowRightOutlined/>}
                        style={{backgroundColor: 'gray'}}
                        key={"pages.searchTable.sub"}
                        onClick={() => {
                          let url =
                            match?.pathname === '/' ? '' : match?.pathname.substring(0, match.pathname.lastIndexOf('/'));
                          return history.push({
                              pathname: `${url}/logRecord/image`,
                              search: `?id=${record.id}`,
                            }
                          );
                        }}
                >
                  <FormattedMessage id="pages.searchTable.sub" defaultMessage="Sub"/>
                </Button>
                <StatisticsForm id={record.id}/>
              </>
            ],
        },
      ]
    ;

    return (
      <PageContainer>
        <ProTable<API.LogRecord, API.PageParams>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: 'Enquiry form',
          })}
          actionRef={actionRef}
          rowKey="id"
          search={{
            defaultCollapsed: false,
            optionRender: (searchConfig, formProps, dom) => [
              ...dom.reverse(),
              <Upload
                key={"upload"}
                showUploadList={false}
                action="http://47.76.127.2:8015/importLiveMonitor"
                maxCount={1}
                data={{
                  name: "tv_channels"
                }}
                headers={{'X-Requested-With': null}}
                onChange={(info) => {
                  console.log("info", info)
                  const {file} = info || {};
                  const {status} = file || {};
                  switch (status) {
                    case 'done':
                      message.success(intl.formatMessage({id: 'pages.upload.success'}));
                      break;
                    case 'error':
                      message.error(file?.response?.code + " : " + file?.response.message)
                      message.error(intl.formatMessage({id: 'pages.upload.fail'}));
                      break;
                    default:
                      setLoadings(true);
                      return;
                  }
                  actionRef.current?.reload();
                  setLoadings(false);
                }}
              >

                <Button type="primary" loading={loadings} icon={<UploadOutlined/>}
                        hidden={!access.uploadLogRecord}>
                  {loadings ? intl.formatMessage({id: 'pages.upload.Uploading'}) : intl.formatMessage({id: 'pages.upload'})}
                </Button>
              </Upload>
            ],
          }}
          expandable={{
            indentSize: 20, // 缩进的大小，单位为 px
            childrenColumnName: 'children', // 子节点的属性名称
          }}
          options={
            {fullScreen: true, setting: true}
          }
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
          request={getLogRecord}
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
                await removeLogRecord(selectedRowsState);
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
            <ProDescriptions<API.LogRecord>
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
                          <FormattedMessage id="pages.searchTable.enable.false"
                                            defaultMessage="Shut down"/>
                        ),
                        status: 'Error',
                      },
                    },
                  }
                }
                return column as ProDescriptionsItemProps<API.LogRecord>[];
              })}
            />
          )}
        </Drawer>
      </PageContainer>
    );
  }
;

export default TableList;

