import React from 'react';
import type {CalendarProps} from 'antd';
import {Button, Calendar, Modal, Statistic} from 'antd';
import type {Dayjs} from 'dayjs';
import dayjs from "dayjs";
import {FundFilled, FundOutlined} from "@ant-design/icons";
import {FormattedMessage} from "@umijs/max";


const CalendarForm: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  const dateCellRender = (value: Dayjs) => {
    console.log("value", value)
    return (
      // <ul className="events">
      //   {listData.map((item) => (
      //     <li key={item.content}>
      //       <Badge status={item.type as BadgeProps['status']} text={item.content}/>
      //     </li>
      //   ))}
      // </ul>
      <Statistic
        title="异常数量"
        value={45}
        valueStyle={{color: '#cf1322'}}
        prefix={<FundFilled/>}
      />
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info?.type === 'date') return dateCellRender(current);
    return info?.originNode;
  };
  const start = dayjs().subtract(1, 'month').startOf('month');
  const end = dayjs().endOf('month'); // 确保是月末
  return (
    <>
      <Button type="primary" size={"small"}
              icon={<FundOutlined/>}
              style={{backgroundColor: 'orange'}}
              key={"pages.searchTable.data"}
              onClick={showLoading}
      >
        <FormattedMessage id="pages.searchTable.data" defaultMessage="Data"/>
      </Button>
      <Modal
        width={"75%"}
        title={<FormattedMessage id="pages.searchTable.data" defaultMessage="Data"/>}
        footer={
          <Button type="primary" onClick={showLoading}>
            <FormattedMessage
              id="pages.searchTable.reset"
              defaultMessage={'Reset'}
            />
          </Button>
        }
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <Calendar cellRender={cellRender} showWeek={true} validRange={[start, end]} mode={"month"} headerRender={null}
                  locale/>
      </Modal>
    </>
  )
};

export default CalendarForm;
