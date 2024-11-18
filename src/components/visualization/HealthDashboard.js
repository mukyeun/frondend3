import React, { useRef } from 'react';
import styled from 'styled-components';
import { useDashboard } from '../../hooks/useDashboard';
import { SORT_OPTIONS } from '../../utils/filterUtils';
import { exportToCSV, parseCSV } from '../../utils/exportUtils';
import HealthChart from './HealthChart';
import BMITrendChart from './BMITrendChart';
import StatsSummary from './StatsSummary';
import LoadingSpinner from '../common/LoadingSpinner';

const HealthDashboard = () => {
  const fileInputRef = useRef(null);
  const { 
    data, 
    stats, 
    filters,
    updateFilters,
    status, 
    error, 
    refreshDashboard 
  } = useDashboard();

  const handleExport = () => {
    exportToCSV(data);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await parseCSV(file);
      console.log('Imported data:', importedData);
      refreshDashboard();
    } catch (error) {
      console.error('Import error:', error);
      alert(error.message);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSortChange = (e) => {
    console.log('Sorting by:', e.target.value);
    updateFilters({ sortOption: e.target.value });
  };

  const testExport = () => {
    console.log('Exporting data:', data);
    exportToCSV(data);
  };

  const testImport = async (file) => {
    try {
      const importedData = await parseCSV(file);
      console.log('Imported data:', importedData);
      refreshDashboard();
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  if (status === 'pending') return <LoadingSpinner />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  console.log('Dashboard data:', data);
  console.log('Dashboard stats:', stats);

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>건강 데이터 대시보드</DashboardTitle>
        <ButtonGroup>
          <ActionButton onClick={handleExport}>내보내기</ActionButton>
          <ActionButton onClick={handleImportClick}>가져오기</ActionButton>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </ButtonGroup>
      </DashboardHeader>

      <FilterSection>
        <FilterGroup>
          <FilterLabel>정렬</FilterLabel>
          <Select
            value={filters.sortOption}
            onChange={handleSortChange}
          >
            <option value={SORT_OPTIONS.DATE_DESC}>날짜 (최신순)</option>
            <option value={SORT_OPTIONS.DATE_ASC}>날짜 (오래된순)</option>
            <option value={SORT_OPTIONS.BMI_DESC}>BMI (높은순)</option>
          </Select>
        </FilterGroup>
      </FilterSection>
      
      <StatsSummary stats={stats} />
      
      <ChartGrid>
        <ChartWrapper>
          <HealthChart data={data} />
        </ChartWrapper>
        <ChartWrapper>
          <BMITrendChart data={data} />
        </ChartWrapper>
      </ChartGrid>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 20px;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const DashboardTitle = styled.h2`
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1557b0;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  color: #666;
`;

const Select = styled.select`
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

const ChartGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
`;

const ChartWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  padding: 20px;
  text-align: center;
`;

export default HealthDashboard;