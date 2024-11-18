import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useHealthInfo } from '../hooks/useHealthInfo';
import SearchBar from './common/SearchBar';
import FilterPanel from './common/FilterPanel';
import Pagination from './common/Pagination';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorBoundary from './common/ErrorBoundary';

const HealthInfoList = () => {
  const {
    listStatus,
    listData,
    listError,
    loadList,
    searchTerm,
    setSearchTerm,
    handleSearch,
    filters,
    handleFilterChange
  } = useHealthInfo();

  useEffect(() => {
    loadList();
  }, [loadList]);

  if (listStatus === 'loading') return <LoadingSpinner />;
  if (listStatus === 'error') throw new Error(listError);

  return (
    <ListContainer>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={() => handleSearch(loadList)}
      />

      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {listData?.items?.length > 0 ? (
        <>
          <Table>
            <thead>
              <tr>
                <Th>날짜</Th>
                <Th>이름</Th>
                <Th>상태</Th>
                <Th>BMI</Th>
                <Th>메모</Th>
              </tr>
            </thead>
            <tbody>
              {listData.items.map(item => (
                <tr key={item.id}>
                  <Td>{new Date(item.createdAt).toLocaleDateString()}</Td>
                  <Td>{item.name}</Td>
                  <Td>{item.status}</Td>
                  <Td>{item.bmi?.toFixed(1)}</Td>
                  <Td>{item.memo}</Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination
            currentPage={listData.currentPage}
            totalPages={listData.totalPages}
            onPageChange={(page) => loadList({ page })}
          />
        </>
      ) : (
        <EmptyState>데이터가 없습니다.</EmptyState>
      )}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const Th = styled.th`
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

// ErrorBoundary로 감싸서 내보내기
export default function HealthInfoListWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <HealthInfoList />
    </ErrorBoundary>
  );
}