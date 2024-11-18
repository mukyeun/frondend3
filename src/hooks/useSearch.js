import { useState, useCallback } from 'react';

export const useSearch = (initialValue = '') => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (searchFunction) => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      await searchFunction(searchTerm);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    handleSearch
  };
};
