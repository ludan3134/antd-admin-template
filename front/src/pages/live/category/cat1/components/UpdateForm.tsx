import {EditFilled, PlusOutlined} from '@ant-design/icons';
import {ProFormSelect, ProFormText, ProFormTextArea, StepsForm,} from '@ant-design/pro-components';
import {Button, Modal} from 'antd';
import React, {useState} from 'react';
import {FormattedMessage, useIntl} from "@@/exports";
import {getXCombOption} from "@/pages/live/category/cat1/config/api/getXCombOption";
import {ProFormDigit, ProFormMoney} from "@ant-design/pro-form/lib";
import {API} from "@/services/ant-design-pro/typings";
import {LiveCat1} from "@/pages/live/category/cat1/config/type/liveCat1";
import {updateliveCat1} from "@/pages/live/category/cat1/config/api/updateLiveCat1";

const LiveCat1UpdateForm: React.FC<API.UpdateFormProps> = ({actionRef, record}) => {
  const [visible, setVisible] = useState(false);
  const intl = useIntl();
  return (
    <>
      <Button
        type="primary"
        size={"small"}
        style={{
          backgroundColor: record ? undefined : 'green' // 使用三元运算符来判断背景颜色
        }}
        icon={record ? <EditFilled/> : <PlusOutlined/>} // 使用三元运算符来判断
        onClick={() => setVisible(true)}
      >
        <FormattedMessage
          id={record ? 'pages.searchTable.edit' : 'pages.searchTable.new'}
          defaultMessage={record ? 'Edit' : 'New'}
        />
      </Button>
      <StepsForm
        onFinish={async (value) => {
          const updatedRecord = {
            ...record, // 先保留record中的所有属性
            ...value   // 然后用value中的属性覆盖record中对应的属性
          };
          const success = await updateliveCat1(updatedRecord as LiveCat1);
          if (success) {
            if (actionRef?.current) {
              actionRef.current?.reload();
              return true
            }
          }
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              title={intl.formatMessage({
                id: 'pages.searchTable.form',
                defaultMessage: 'Form',
              })}
              width={800}
              onCancel={() => setVisible(false)}
              open={visible}
              footer={submitter}
              destroyOnClose
            >
              {dom}
            </Modal>
          );
        }}
      >
        <StepsForm.StepForm
          name="step1"
          title={intl.formatMessage({
            id: 'pages.searchTable.step1',
            defaultMessage: 'Step1',
          })}
        >
          <ProFormText
            name="name"
            width="md"
            label={intl.formatMessage({
              id: 'liveCat1.table.name',
              defaultMessage: 'Name',
            })}
            initialValue={record?.name}
            rules={[{required: true}]}
          />
          <ProFormText
            name="zhName"
            width="md"
            label={intl.formatMessage({
              id: 'liveCat1.table.zhName',
              defaultMessage: 'zhName',
            })}
            initialValue={record?.zhName}
            rules={[{required: true}]}
          />
          <ProFormText
            name="listName"
            width="md"
            label={intl.formatMessage({
              id: 'liveCat1.table.listName',
              defaultMessage: 'listName',
            })}
            initialValue={record?.listName}
            rules={[{required: true}]}
          />
          <ProFormSelect
            label={intl.formatMessage({
              id: 'liveCat1.table.probation',
              defaultMessage: 'Probation',
            })}
            name="probation"
            width="md"
            initialValue={record?.probation}
            options={[
              {value: '3day', label: '3day'},
              {value: '1year', label: '1year'},
            ]}
            rules={[{required: true}]}
          />
          <ProFormSelect
            name="comboId"
            width="md"
            label={intl.formatMessage({
              id: 'liveCat1.table.comboName',
              defaultMessage: 'comboName',
            })}
            initialValue={record?.comboId}
            request={async () => {
              const res = await getXCombOption();
              // 这个选择接口要改动
              return res?.xstreamComboList; // 返回菜单数据
            }}
            fieldProps={{
              fieldNames: {
                key: 'id',
                label: "label",
                value: "id",
              },
            }}
            rules={[{required: true}]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="checkbox"
          title={intl.formatMessage({
            id: 'pages.searchTable.step2',
            defaultMessage: 'Step2',
          })}>
          <ProFormTextArea
            name="description"
            label={intl.formatMessage({
              id: 'liveCat1.table.description',
              defaultMessage: 'Description',
            })}
            width="lg"
          />
          <ProFormMoney
            name="price"
            label={intl.formatMessage({
              id: 'liveCat1.table.price',
              defaultMessage: 'Price',
            })}
            width="lg"
            initialValue={record?.price}
          />
          <ProFormDigit
            name="sort"
            label={intl.formatMessage({
              id: 'liveCat1.table.sort',
              defaultMessage: 'Sort',
            })}
          />
          <ProFormSelect
            label={intl.formatMessage({
              id: 'liveCat1.table.isShow',
              defaultMessage: 'isShow',
            })}
            name="isShow"
            width="md"
            initialValue={record?.isShow ? true : false}
            options={[
              {value: true, label: 'true',},
              {value: false, label: 'false'},
            ]}
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormSelect
            label={intl.formatMessage({
              id: 'liveCat1.table.isCharge',
              defaultMessage: 'isCharge',
            })}
            name="isCharge"
            width="md"
            initialValue={record?.isCharge ? true : false}
            options={[
              {value: true, label: 'true',},
              {value: false, label: 'false'},
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="time"
          title={intl.formatMessage({
            id: 'pages.searchTable.step3',
            defaultMessage: 'Step3',
          })}>
          <ProFormMoney
            name="oneMonthPrice"
            width="md"
            label={intl.formatMessage({
              id: 'liveCat1.table.oneMonthPrice',
              defaultMessage: 'oneMonthPrice',
            })}
          />
          <ProFormMoney
            name="threeMonthPrice"
            width="md"
            label={intl.formatMessage({
              id: 'liveCat1.table.threeMonthPrice',
              defaultMessage: 'threeMonthPrice',
            })}
          />
          <ProFormMoney
            name="sixMonthPrice"
            width="md"
            label={intl.formatMessage({
              id: 'liveCat1.table.sixMonthPrice',
              defaultMessage: 'sixMonthPrice',
            })}
          />
          <ProFormMoney
            name="nineMonthPrice"
            width="md"
            label={intl.formatMessage({
              id: 'liveCat1.table.nineMonthPrice',
              defaultMessage: 'nineMonthPrice',
            })}
          />
          <ProFormMoney
            name="twelveMonthPrice"
            width="md"
            label={intl.formatMessage({
              id: 'liveCat1.table.twelveMonthPrice',
              defaultMessage: 'twelveMonthPrice',
            })}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </>
  );
};
export default LiveCat1UpdateForm
