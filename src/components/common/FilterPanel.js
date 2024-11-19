import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: #495057;
`;

const FilterSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
`;

function FilterPanel({ filters, onFilterChange }) {
  return (
    <FilterContainer>
      <FilterGroup>
        <FilterLabel>상태</FilterLabel>
        <FilterSelect
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="">전체</option>
          <option value="정상">정상</option>
          <option value="주의">주의</option>
          <option value="위험">위험</option>
        </FilterSelect>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>기간</FilterLabel>
        <FilterSelect
          value={filters.period || ''}
          onChange={(e) => onFilterChange({ ...filters, period: e.target.value })}
        >
          <option value="">전체기간</option>
          <option value="1week">1주일</option>
          <option value="1month">1개월</option>
          <option value="3months">3개월</option>
          <option value="6months">6개월</option>
        </FilterSelect>
      </FilterGroup>
    </FilterContainer>
  );
}

export default FilterPanel;
