import {useEffect, useState} from "react";
import {ProCard} from "@ant-design/pro-components";
import {ColumnChart} from 'bizcharts';
import moment from "moment";
import {useIntl} from "@@/exports";
import {getColumnData} from "@/pages/dashboard/analysis/components/config/api/getColumnData";
import {ColumnData} from "@/pages/dashboard/analysis/components/config/mockData/data";


const ColumnCard = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([]);
  const intl = useIntl();

  const getData = async () => {
    let now = moment().format('YYYY-MM-DD');
    const res = await getColumnData({
      name: null,
      timeRange: [now, now]
    });
    setData(res.data || ColumnData)
    setLoading(false)
  };
  useEffect(() => {
    getData();
  }, []);

  return (
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
        items: [
          {
            label: intl.formatMessage({
              id: 'column.chart.title',
              defaultMessage: 'Column Chart',
            }),
            key: 'Unique',
            children:
              <ColumnChart
                data={data}
                autoFit
                padding='auto'
                xField='name'
                yField='num'
                label={{
                  visible: true,
                  labelHeight: 28,
                }}
                interactions={[
                  {
                    type: 'scrollbar',
                  },
                ]}
                slider={
                  {start: 0, end: data?.length}
                }
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
        ],
      }}
    />
  );
};
export default ColumnCard;
