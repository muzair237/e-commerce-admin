import React, { useEffect } from 'react';
import { Card, CardHeader, Col } from 'reactstrap';
import ReactEcharts from 'echarts-for-react';
import { useDispatch, useSelector } from 'react-redux';
import dashboardThunk from '../../../slices/dashboard/thunk';

const PieChart = () => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state?.Dashboard?.ageGroups);

  useEffect(() => {
    dispatch(dashboardThunk.getAgeGroups());
  }, []);

  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        // The style of the legend text
        color: '#858d98',
      },
    },
    // color: chartPieColors,
    series: [
      {
        name: 'Users From',
        type: 'pie',
        radius: '50%',
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],

    textStyle: {
      fontFamily: 'Poppins, sans-serif',
    },
  };

  return (
    <Col xl={6}>
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">Users by Age Groups</h4>
        </CardHeader>
        <div className="card-body">
          <ReactEcharts style={{ height: '350px' }} option={option} />
        </div>
      </Card>
    </Col>
  );
};

export default PieChart;
