import { useState, useCallback } from 'react';

export const useFilter = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    handleFilterChange,
    resetFilters
  };
};
