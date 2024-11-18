import React from 'react';
import styled from 'styled-components';

const StatsSummary = ({ stats }) => {
  return (
    <SummaryContainer>
      <SummaryTitle>건강 통계 요약</SummaryTitle>
      <StatsGrid>
        <StatCard>
          <StatLabel>평균 BMI</StatLabel>
          <StatValue>{stats?.averageBMI?.toFixed(1) || '-'}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>평균 체중</StatLabel>
          <StatValue>{stats?.averageWeight?.toFixed(1) || '-'} kg</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>기록 수</StatLabel>
          <StatValue>{stats?.totalRecords || 0}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>최근 측정일</StatLabel>
          <StatValue>{stats?.lastMeasureDate || '-'}</StatValue>
        </StatCard>
      </StatsGrid>
    </SummaryContainer>
  );
};

const SummaryContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const SummaryTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
`;

export default StatsSummary;
