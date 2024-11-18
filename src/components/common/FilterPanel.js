import React from 'react';
import styled from 'styled-components';

const FilterPanel = ({ filters, onFilterChange }) => {
  const handleFilterChange = (filterKey, value) => {
    onFilterChange({
      ...filters,
      [filterKey]: value
    });
  };

  return (
    <FilterContainer>
      <FilterGroup>
        <FilterLabel>날짜 범위</FilterLabel>
        <FilterSelect
          value={filters.dateRange || ''}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
        >
          <option value="">전체 기간</option>
          <option value="today">오늘</option>
          <option value="week">이번 주</option>
          <option value="month">이번 달</option>
          <option value="year">올해</option>
        </FilterSelect>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>상태</FilterLabel>
        <FilterSelect
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">전체 상태</option>
          <option value="normal">정상</option>
          <option value="caution">주의</option>
          <option value="warning">경고</option>
        </FilterSelect>
      </FilterGroup>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
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

const FilterSelect = styled.select`
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

export default FilterPanel;
