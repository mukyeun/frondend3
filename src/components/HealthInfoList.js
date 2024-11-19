import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useHealthInfo } from '../hooks/useHealthInfo';
import SearchBar from './common/SearchBar';
import FilterPanel from './common/FilterPanel';
import Pagination from './common/Pagination';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorBoundary from './common/ErrorBoundary';
import ActionButtons from './ActionButtons';
import { healthInfoService } from '../services/api';
import { getHealthInfoList } from '../api/healthInfo';

const HealthInfoList = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const {
    listStatus,
    listData,
    listError,
    loadList,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    handleEdit,
    handleDelete,
  } = useHealthInfo();

  // 검색어 입력 핸들러 수정
  const handleInputChange = useCallback((e) => {
    e.preventDefault();  // 기본 이벤트 방지
    const value = e.target.value;
    setSearchTerm(value);  // 검색어 상태만 업데이트
  }, [setSearchTerm]);

  // 검색 실행 핸들러 수정
  const handleSearchSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // 검색어가 비어있으면 전체 목록 로드
    if (!searchTerm.trim()) {
      loadList();
      return;
    }

    // 검색 실행
    try {
      await loadList({
        name: searchTerm,
        ...filters
      });
    } catch (err) {
      console.error('검색 오류:', err);
    }
  }, [searchTerm, filters, loadList]);

  // 초기 데이터 로드
  useEffect(() => {
    loadList();
  }, [loadList]);

  // 전체 선택/해제 처리
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(listData?.items?.map(item => item.id) || []);
    } else {
      setSelectedItems([]);
    }
  };

  // 개별 항목 선택/해제 처리
  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 선택된 항목 일괄 삭제
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    if (window.confirm(`선택한 ${selectedItems.length}개 항목을 삭제하시겠습니까?`)) {
      try {
        await Promise.all(selectedItems.map(id => healthInfoService.delete(id)));
        setSelectedItems([]);
        loadList();
        alert('선택한 항목이 삭제되었습니다.');
      } catch (error) {
        console.error('Bulk delete error:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (listStatus === 'loading') return <LoadingSpinner />;
  if (listStatus === 'error') return <div>에러: {listError}</div>;

  return (
    <ListContainer>
      <SearchBar
        value={searchTerm}
        onChange={handleInputChange}
        onSearch={handleSearchSubmit}  // 검색 버튼 클릭시에만 실행
      />

      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {selectedItems.length > 0 && (
        <DeleteButton onClick={handleBulkDelete}>
          선택한 항목 삭제 ({selectedItems.length}개)
        </DeleteButton>
      )}

      {listData?.items?.length > 0 ? (
        <>
          <Table>
            <thead>
              <tr>
                <Th>
                  <Checkbox
                    type="checkbox"
                    checked={selectedItems.length === listData.items.length}
                    onChange={handleSelectAll}
                  />
                </Th>
                <Th>날짜</Th>
                <Th>이름</Th>
                <Th>연락처</Th>
                <Th>나이</Th>
                <Th>성별</Th>
                <Th>성격</Th>
                <Th>BMI</Th>
                <Th>스트레스</Th>
                <Th>노동강도</Th>
                <Th>증상</Th>
                <Th>혈압</Th>
                <Th>복용약물</Th>
              </tr>
            </thead>
            <tbody>
              {listData.items.map(item => (
                <tr key={item.id}>
                  <Td>
                    <Checkbox
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </Td>
                  <Td>{item.날짜}</Td>
                  <Td>{item.이름}</Td>
                  <Td>{item.연락처}</Td>
                  <Td>{item.나이}</Td>
                  <Td>{item.성별}</Td>
                  <Td>{item.성격}</Td>
                  <Td>{item.BMI}</Td>
                  <Td>{item.스트레스}</Td>
                  <Td>{item.노동강도}</Td>
                  <Td>{item.증상}</Td>
                  <Td>{item.혈압}</Td>
                  <Td>{item.복용약물}</Td>
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
  margin: 1rem 0;
  font-size: 0.9rem;
`;

const Th = styled.th`
  background-color: #f8f9fa;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #c82333;
  }
`;

// ErrorBoundary로 감싸서 내보내기
export default function HealthInfoListWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <HealthInfoList />
    </ErrorBoundary>
  );
}