import React from 'react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const HealthChart = ({ data }) => {
  return (
    <ChartContainer>
      <ChartTitle>건강 지표 추이</ChartTitle>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="bmi" 
            stroke="#8884d8" 
            name="BMI"
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#82ca9d" 
            name="체중"
          />
        </LineChart>
      </ResponsiveContainer>
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

export default HealthChart;
