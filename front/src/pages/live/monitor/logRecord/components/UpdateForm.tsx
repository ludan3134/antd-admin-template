import React, {useRef, useState} from 'react';
import {ModalForm, ProFormText} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from "@@/exports";
import {ProFormInstance} from "@ant-design/pro-form/lib";
import {Button} from "antd";
import {EditFilled, PlusOutlined} from "@ant-design/icons";
import {API} from "@/services/ant-design-pro/typings";
import {updatelogRecord} from "@/pages/live/monitor/logRecord/config/api/updateLogRecord";

const LogRecordUpdateForm: React.FC<API.UpdateFormProps> = ({actionRef, record}) => {
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
                    const success = await updatelogRecord(value as API.LogRecord);
                    if (success) {
                        if (actionRef?.current) {
                            actionRef.current?.reload();
                            return true
                        }
                    }
                }}
                formRef={formRef}
                submitter={{
                    searchConfig: intl.formatMessage({
                        id: 'pages.searchTable.reset',
                        defaultMessage: 'Reset',
                    }),
                    resetButtonProps: {
                        onClick: () => {
                            formRef.current?.resetFields();
                        },
                    },
                }}
                request={async () => {
                    return {...record.record} as API.LogRecord
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
            >
                {/*角色名称*/}
                <ProFormText
                    name="id"
                    placeholder={intl.formatMessage({
                        id: 'pages.searchTable.id',
                        defaultMessage: 'id',
                    })}
                    hidden={true}
                    initialValue={record?.id}
                />
                <ProFormText
                    name="name"
                    placeholder={intl.formatMessage({
                        id: 'logRecord.table.name',
                        defaultMessage: 'Name',
                    })}
                    rules={[
                        {required: true, message: intl.formatMessage({id: 'logRecord.updateForm.rule.name'})},
                        {
                            pattern: /^[a-zA-Z]{1,15}$/,
                            message: intl.formatMessage({id: 'logRecord.updateForm.rule.name'})
                        }
                    ]}
                />

            </ModalForm>
        </>
    );
};

export default LogRecordUpdateForm;
