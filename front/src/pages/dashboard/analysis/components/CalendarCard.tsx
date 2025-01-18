import {ProCard, ProFormSelect,} from '@ant-design/pro-components';
import {ProFormDateRangePicker} from "@ant-design/pro-form";
import {QueryFilter} from "@ant-design/pro-form/lib";
import ReactECharts from "echarts-for-react";
import React, {useEffect, useState} from "react";
import moment from "moment";
import {getCalendarData} from "@/pages/dashboard/analysis/components/config/api/getCalendarData";
import {getOption} from "@formatjs/intl-utils";
import {useIntl} from "@@/exports";
import {CalendarData} from "@/pages/dashboard/analysis/components/config/mockData/data";


const CalendarCard = () => {
  const intl = useIntl();
  const dateFormat = 'YYYY-MM-DD'; // 定义日期格式
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [start, setStart] = useState(moment().subtract(1, 'months').format('YYYY-MM-DD'))
  const [end, setEnd] = useState(moment().format('YYYY-MM-DD'))

  const getData = async (filter: any) => {
    const res = await getCalendarData({
      name: filter?.name,
      timeRange: [filter?.timeRange[0], filter?.timeRange[1]]
    });
    setData(res.data || CalendarData)
    setStart(filter?.timeRange[0] || start)
    setEnd(filter?.timeRange[1] || end)
    setLoading(false)
  };
  useEffect(() => {
    getData({name: null, timeRange: [start, end]});
  }, []);
  const loadingOption = {
    text: 'loading...',
    color: '#4413c2',
    textColor: '#270240',
    maskColor: 'rgba(194, 88, 86, 0.3)',
    zlevel: 0
  };
  const option = {
    tooltip: {
      trigger: 'item',
      borderWidth: 0,
      formatter: (params: any) => {
        console.log("params", params)
        return `<div><b>${params.value[0]}</b> : ${params.value[1]}</div>`
      },
    },
    visualMap: {
      min: 0,
      max: 10000,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 0
    },

    calendar: {
      top: 50,
      left: 50,
      right: 50,
      cellSize: [25, 25],
      range: [start, end],
      itemStyle: {
        borderWidth: 1,
        borderColor: '#fff',
      },
      yearLabel: {show: false},
      monthLabel: {
        // nameMap: 'ZH',
        color: 'rgb(140,140,140)',
        align: 'center',
        margin: 6,
        nameMap: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

      },
      dayLabel: {
        firstDay: 0,
        fontSize: 14,
        margin: 16,
        color: 'rgb(140,140,140)',
        verticalAlign: 'middle',
        nameMap: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
      },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: data,
    }
  };

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
              id: 'calendar.chart.title',
              defaultMessage: 'Calendar Chart',
            }),
            key: 'Unique',
            children: (
              <ReactECharts
                option={option}
                loadingOption={loadingOption}
              />
            ),
          },
        ],
        tabBarExtraContent: (
          <QueryFilter
            span={9}
            defaultColsNumber={4}
            labelWidth={0}
            split
            submitterColSpanProps={{span: 6}}
            onFinish={async (value) => {
              if (value?.timeRange) {
                value.timeRange[0] = moment(value.timeRange[0]).format(dateFormat);
                value.timeRange[1] = moment(value.timeRange[1]).format(dateFormat);
              }
              return getData(value)
            }}
          >
            <ProFormSelect
              name="name"
              showSearch={true}
              debounceTime={500}   //防止抖动
              width={"sm"}
              request={async ({keyWords}) => {
                console.log('fetch...', keyWords)
                let res = await getOption({name: keyWords})
                return new Promise(reslove => {
                  setTimeout(() => {
                    reslove(Array.from({length: 10}, (_, i) => ({
                      label: 'a' + i + '-' + keyWords,
                      value: 'a' + i + '-' + keyWords
                    })))
                  }, 300);
                })
              }}
              placeholder={intl.formatMessage({
                id: 'calendar.chart.name',
                defaultMessage: 'Name',
              })}
            />
            <ProFormDateRangePicker
              initialValue={[start, end]}
              name="timeRange"
            />
          </QueryFilter>
        ),
      }}
    />
  );
};
export default CalendarCard;
