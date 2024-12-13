import React, { useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, CardHeader, Col } from 'reactstrap';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import dashboardThunk from '../../../slices/dashboard/thunk';

const GaugeChart = () => {
  const dispatch = useDispatch();
  const { todayQueryCount } = useSelector(state => state?.Dashboard?.todayQueryCount);
  const option = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    textStyle: {
      fontFamily: 'Poppins, sans-serif',
    },
    series: [
      {
        name: '',
        type: 'gauge',
        progress: {
          show: true,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: '#858d98',
        },
        axisLabel: {
          color: '#858d98',
        },
        data: [
          {
            title: {
              color: '#858d98',
            },
            value: todayQueryCount,
            name: 'Query Count',
          },
        ],
      },
    ],
  };

  useEffect(() => {
    dispatch(dashboardThunk.getTodayQueryCount());
  }, []);

  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0">Total Queries Asked Today - {format(new Date(), 'yyyy-MM-dd')}</h4>
          </CardHeader>
          <div className="card-body">
            <ReactEcharts style={{ height: '350px' }} option={option} />
          </div>
        </Card>
      </Col>
    </>
  );
};

export default GaugeChart;
