import React, {useEffect, useState} from 'react';
import {ProCard} from "@ant-design/pro-components";
import {PieChart,} from "bizcharts";
import moment from "moment";
import {getPieData} from "@/pages/dashboard/analysis/components/config/api/getPieData";
import {useIntl} from "@@/exports";
import {PieData} from "@/pages/dashboard/analysis/components/config/mockData/data";

const PieChartCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const intl = useIntl();

  const getData = async () => {
    let now = moment().format('YYYY-MM-DD');
    const res = await getPieData({
      name: null,
      timeRange: [now, now]
    });
    setData(res.data || PieData)
    setLoading(false)
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <ProCard
      bordered={false}
      bodyStyle={{
        padding: 0,
      }}
      loading={loading}
      tabs={{
        type: 'card',
        size: 'large',
        items: [
          {
            label: intl.formatMessage({
              id: 'pie.chart.title',
              defaultMessage: 'Pie Chart',
            }),
            key: 'Unique',
            children:
              <PieChart
                data={data}
                radius={0.8}
                angleField='num'
                colorField='name'
                label={{
                  visible: true,
                  type: 'spider',
                  labelHeight: 28,
                  content: v => `${v.name} : ${v.num}`
                }}
              />
          },
        ],
      }}
    />
  );
};
export default PieChartCard;
