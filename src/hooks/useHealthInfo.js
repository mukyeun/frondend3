import { useCallback } from 'react';
import { useAsync } from './useAsync';
import { healthInfoService } from '../services/api';
import { useSearch } from './useSearch';
import { useFilter } from './useFilter';

export const useHealthInfo = () => {
  const {
    execute: fetchList,
    status: listStatus,
    data: listData,
    error: listError
  } = useAsync(healthInfoService.getList);

  const {
    execute: fetchOne,
    status: itemStatus,
    data: itemData,
    error: itemError
  } = useAsync(healthInfoService.getById);

  const { searchTerm, setSearchTerm, handleSearch } = useSearch();
  const { filters, handleFilterChange, resetFilters } = useFilter();

  const loadList = useCallback(async (params = {}) => {
    const searchParams = {
      ...params,
      search: searchTerm,
      ...filters
    };
    return fetchList(searchParams);
  }, [fetchList, searchTerm, filters]);

  const loadItem = useCallback(async (id) => {
    return fetchOne(id);
  }, [fetchOne]);

  return {
    // 목록 관련
    listStatus,
    listData,
    listError,
    loadList,

    // 단일 항목 관련
    itemStatus,
    itemData,
    itemError,
    loadItem,

    // 검색 관련
    searchTerm,
    setSearchTerm,
    handleSearch,

    // 필터 관련
    filters,
    handleFilterChange,
    resetFilters
  };
};
