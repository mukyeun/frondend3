import { useState, useCallback } from 'react';
import { getHealthInfoList } from '../api/healthInfo';
import { useAsync } from './useAsync';

export const useHealthInfoList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { loading, error, execute: fetchList } = useAsync(getHealthInfoList);

  const loadHealthInfoList = useCallback(async (page = 1) => {
    try {
      const response = await fetchList({ page, limit: 10 });
      setTotalPages(Math.ceil(response.total / 10));
      setCurrentPage(page);
      return response.items;
    } catch (error) {
      console.error('Failed to load health info list:', error);
      throw error;
    }
  }, [fetchList]);

  const handlePageChange = useCallback(async (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    await loadHealthInfoList(newPage);
  }, [totalPages, loadHealthInfoList]);

  return {
    loading,
    error,
    currentPage,
    totalPages,
    loadHealthInfoList,
    handlePageChange
  };
};
