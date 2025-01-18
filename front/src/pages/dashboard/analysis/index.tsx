import {GridContent, PageContainer} from '@ant-design/pro-components';
import {Card, Col, Row, Statistic} from 'antd';
import {Suspense, useEffect, useState} from 'react';
import ColumnCard from "@/pages/dashboard/analysis/components/columnCard";
import PieChartCard from "@/pages/dashboard/analysis/components/PieChartCard";
import CalendarCard from "@/pages/dashboard/analysis/components/CalendarCard";
import moment from "moment";
import {ClockCircleOutlined} from "@ant-design/icons";

const Analysis = () => {
  let date = moment().format('YYYY-MM-DD');
  const [now, setNow] = useState(moment().format('HH:mm:ss'));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(moment().format('HH:mm:ss'));
    }, 1000);

    // 清除定时器
    return () => clearInterval(timer);
  }, []);
  return (
    <PageContainer
      header={{
        breadcrumb: {},
      }}
      title={
        <Statistic title={date} value={now} prefix={<ClockCircleOutlined/>}/>
      }
    >
      <GridContent>
        <>
          <Row
            gutter={24}
            style={{
              marginTop: 24,
              marginBottom: 24
            }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ColumnCard/>
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <PieChartCard/>
              </Suspense>
            </Col>
          </Row>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <CalendarCard/>
            </Suspense>
          </Col>
        </>
      </GridContent>
    </PageContainer>
  );
};
export default Analysis;
