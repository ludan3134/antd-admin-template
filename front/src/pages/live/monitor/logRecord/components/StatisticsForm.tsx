import React, {useState} from 'react';
import {Button, Calendar, CalendarProps, Col, Modal, Row, Statistic} from 'antd';
import {
  BarChartOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FundOutlined,
  SmileOutlined
} from "@ant-design/icons";
import {FormattedMessage} from "@umijs/max";
import {ColumnChart} from "bizcharts";
import {ColumnData} from "@/pages/dashboard/analysis/components/config/mockData/data";
import moment from "moment";
import {ProCard} from "@ant-design/pro-components";
import {useIntl} from "@@/exports";
import dayjs, {Dayjs} from "dayjs";
import {getColumnData} from "@/pages/live/monitor/logRecord/config/api/getColumnData";
import {getCalendarData} from "@/pages/live/monitor/logRecord/config/api/getCalendarData";


const StatisticsForm: React.FC = ({id}) => {
  const [tab, setTab] = useState('Unique01');
  const intl = useIntl();
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [data01, setData01] = useState([]);
  const [data02, setData02] = useState([]);
  const start = dayjs().subtract(1, 'month').startOf('month');
  const end = dayjs().endOf('month');

  const getData01 = async () => {
    let now = moment().format('YYYY-MM-DD');
    const res = await getColumnData({
      id: id,
      timeRange: [now, now]
    });
    setData01(res.data || ColumnData)
    setLoading(false)
  };

  const getData02 = async () => {
    const res = await getCalendarData({
      id: id,
      timeRange: [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")]
    });
    setData02(res.data || ColumnData)
    setLoading(false)
  };
  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      getData01()
        .then(() => {
          setLoading(false);
        })
      setLoading(false);
    }, 100);
  };
  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current) => {
    const matchedData = data02.find(item => item.date === current.format("YYYY-MM-DD"));
    console.log("matchedData", matchedData)
    return matchedData ? (
        <>
          <Row>
            <Statistic
              value={matchedData.total}
              valueStyle={{color: 'blue'}}
              prefix={<BarChartOutlined/>}
            />
          </Row>
          <Row>
            <Col span={12}>
              <Statistic
                value={matchedData.normal}
                valueStyle={{color: 'green'}}
                prefix={<CheckCircleOutlined/>}
              />
            </Col>
            <Col span={12}>
              <Statistic
                value={matchedData.abnormal}
                valueStyle={{color: 'red'}}
                prefix={<ExclamationCircleOutlined/>}
              />
            </Col>
          </Row>
        </>
      ) :
      <div style={{textAlign: 'center'}}>
        <SmileOutlined style={{fontSize: 20}}/>
        <p>Data Not Found</p>
      </div>;
  };

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
        // title={<FormattedMessage id="pages.searchTable.data" defaultMessage="Data"/>}
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
        <ProCard
          loading={loading}
          bordered={false}
          layout="center"
          bodyStyle={{
            padding: 0,
          }}
          tabs={{
            type: 'card',
            size: 'large',
            activeKey: tab,
            items: [
              {
                label: intl.formatMessage({
                  id: 'column.chart.title',
                  defaultMessage: 'Column Chart',
                }),
                key: 'Unique01',
                children:
                  <ColumnChart
                    data={data01}
                    autoFit
                    padding='auto'
                    xField='name'
                    yField='num'
                    label={{
                      visible: true,
                      labelHeight: 28,
                    }}
                    scrollbar={{
                      type: 'horizontal', // 设置为横向滚动条
                    }}
                    meta={{
                      type: {
                        alias: '频道名',
                      },
                      sales: {
                        alias: '异常数量',
                      },
                    }}
                  />
              },
              {
                label: intl.formatMessage({
                  id: 'calendar.chart.title',
                  defaultMessage: 'Calendar',
                }),
                key: 'Unique02',
                children:
                  <Calendar cellRender={cellRender} showWeek={true} validRange={[start, end]} mode={"month"}
                            headerRender={null}
                            onSelect={(date, selectInfo) => {
                              console.log("date", date)
                              console.log("selectInfo", selectInfo)
                            }}
                            locale/>
              },
            ],
            onChange: (key) => {
              if (key === "Unique01") {
                getData01()
              } else if (key === "Unique02") {
                getData02()
              }
              setTab(key);
            },
          }}
        />
      </Modal>
    </>
  )
};

export default StatisticsForm;
