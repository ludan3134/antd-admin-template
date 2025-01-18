import {ActionType, FooterToolbar, PageContainer, ProFormSelect, ProList,} from '@ant-design/pro-components';
import {Alert, Button, Image, message, Progress, Tooltip} from 'antd';
import type {Key} from 'react';
import React, {useEffect, useRef, useState} from 'react';
import {
  AudioFilled,
  CheckCircleFilled,
  DeleteFilled,
  ExclamationCircleFilled,
  VideoCameraFilled
} from "@ant-design/icons";
import {useLocation} from "@@/exports";
import {FormattedMessage, useIntl} from '@umijs/max';

import {removeMenu} from "@/pages/Menu/config/api/removeMenu";
import {API} from "@/services/ant-design-pro/typings";
import {getImage} from "@/pages/live/monitor/imageList/config/api/getImage";

export default () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: Key[]) => setSelectedRowKeys(keys),
  };
  const {search} = useLocation();
  let searchParams = new URLSearchParams(search);
  const [percent, setPercent] = useState<number>(0);

  // 设置定时器，每5分钟更新一次时间
  useEffect(() => {
    // 设置5分钟的倒计时
    const timer = setInterval(() => {
      setPercent((prevPercent) => {
        const newPercent = prevPercent + (100 / (5 * 60));
        console.log("newPercent",newPercent)
        if (newPercent > 100) {
          message.loading("正在刷新")
          actionRef?.current?.reload()
          return 0;
        }
        return newPercent;
      });
    }, 1000); // 每秒更新一次

    // 组件卸载时清除定时器
    return () => clearInterval(timer);
  }, []); // 依赖项为空数组，只在组件挂载时设置定时器


  return (
    <PageContainer>
      <ProList<API.ProListItem, API.PageParams>
        request={async (params) => {
          return await getImage(params, {rid: searchParams.get("id")})
        }}

        indentSize={55}
        pagination={{
          defaultPageSize: 60,
          showSizeChanger: false,
        }}
        actionRef={actionRef}
        size={"small"}
        search={{
          labelWidth: 120,
        }}
        rowSelection={rowSelection}
        rowKey="title"
        showActions="hover"
        grid={{gutter: 1, column: 15}}
        options={{fullScreen: true, setting: true}}
        onItem={(record: any) => {
          return {
            onMouseEnter: () => {
              console.log(record);
            },
            onClick: () => {
              console.log(record);
            },
          };
        }}
        toolBarRender={() => [
          <Progress key={'progress'} percent={percent} strokeLinecap="butt" type="dashboard" size={"small"}
                    format={(percent) => `${Math.ceil((100 - percent) / (100 / (5 * 60)))}s`}
                    strokeWidth={24}/>
        ]}
        metas={{
          title: {
            align: 'center',
            title: (intl.formatMessage({
              id: 'image.table.name',
              defaultMessage: 'Name',
            })),
            render: (value) => {
              return (
                <Tooltip title={`${value}`}>
                                    <span style={{
                                      display: "inline-block",
                                      width: "100px",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                      textAlign: 'center'
                                    }}>{`${value}`}
                                    </span>
                </Tooltip>
              );
            },
          },
          content: {
            title: (
              <FormattedMessage
                id="image.table.content"
                defaultMessage="Content"
              />
            ),
            dataIndex: "content",
            hideInSearch: true,
            render: (value) => {
              return (
                <Image src={`${value}`}/>
              );
            },
          },
          subTitle: {
            title: (<FormattedMessage
              id="image.table.status"
              defaultMessage="Status"
            />),
            render: () => {
              return null
            },
            renderFormItem: (_, fieldConfig, form) => {
              return (
                <ProFormSelect
                  name="subTitle"
                  label="状态值"
                  allowClear={false}
                  initialValue={-1}
                  request={async () => [
                    {label: '未检测', value: 0},
                    {label: '正常', value: 1},
                    {label: '拉流失败', value: 2},
                    {label: '缺少视频流', value: 3},
                    {label: '音频率', value: 4},
                    {label: '静帧', value: 5},
                    {label: '全部', value: -1},
                  ]}
                />
              );
            },
          },
          actions: {
            cardActionProps: "actions",
            render: (value, record) => {
              let alertType = 'error'; // 默认类型
              let alertMessage = 'Default Message';
              let icon = null


              switch (record?.subTitle) {
                case 0:
                  alertType = 'warning';
                  alertMessage = '未检测';
                  icon = <DeleteFilled style={{color: '#faad14'}}/>; // 黄色
                  break;
                case 1:
                  alertType = 'success';
                  alertMessage = '正常';
                  icon = <CheckCircleFilled style={{color: '#52c41a'}}/>; // 绿色
                  break;
                case 2:
                  alertType = 'warning';
                  alertMessage = '拉流失败';
                  icon = <ExclamationCircleFilled style={{color: '#faad14'}}/>; // 黄色
                  break;
                case 3:
                  alertType = 'error';
                  alertMessage = '缺少视频流';
                  icon = <VideoCameraFilled style={{color: '#f5222d'}}/>; // 红色
                  break;
                case 4:
                  alertType = 'info';
                  alertMessage = '音频率';
                  icon = <AudioFilled style={{color: '#1890ff'}}/>; // 蓝色
                  break;
                case 5:
                  alertType = 'warning';
                  alertMessage = '静帧';
                  icon = <ExclamationCircleFilled style={{color: '#faad14'}}/>; // 黄色
                  break;
                default:
                  // 可以在这里处理未知 subtitle 的情况
                  break;
              }
              return (
                [<Alert message={alertMessage} key={"alert"} type={alertType} style={{width: "100%"}}
                        showIcon={icon !== null}
                        icon={icon}/>]
              );
            },
          }

        }}
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
      />
      {selectedRowKeys?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen"/>{' '}
              <a style={{fontWeight: 600}}>{selectedRowKeys.length}</a>{' '}
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
              console.log("selectedRowKeys", selectedRowKeys)
              await removeMenu(selectedRowKeys);
              setSelectedRowKeys([])
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
    </PageContainer>
  );
};
//
