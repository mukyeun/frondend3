import React from 'react';
import styled from 'styled-components';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const BMITrendChart = ({ data }) => {
  return (
    <ChartContainer>
      <ChartTitle>BMI 변화 추이</ChartTitle>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="bmi" 
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
            name="BMI"
          />
        </AreaChart>
      </ResponsiveContainer>
      <ChartLegend>
        <LegendItem>
          <LegendColor color="#8884d8" /> BMI
        </LegendItem>
      </ChartLegend>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2rem;
`;

const ChartLegend = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  margin-right: 5px;
  background-color: ${props => props.color};
  border-radius: 2px;
`;

export default BMITrendChart;
